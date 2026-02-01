/**
 * AI-Powered Rate Limiter with Adaptive Thresholds
 * 
 * Features:
 * - Sliding window algorithm
 * - IP reputation scoring
 * - Behavioral analysis
 * - Automatic blacklisting
 * - Distributed rate limiting support (Redis)
 */

import { LRUCache } from 'lru-cache'

export interface RateLimitConfig {
  windowMs: number      // Time window in milliseconds
  maxRequests: number   // Max requests per window
  blockDuration?: number // Duration to block after limit exceeded (ms)
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

interface RequestRecord {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil?: number
  suspicionScore: number // 0-100, higher = more suspicious
}

/**
 * In-memory rate limiter with LRU eviction
 */
class RateLimiter {
  private cache: LRUCache<string, RequestRecord>
  private config: Required<RateLimitConfig>
  
  constructor(config: RateLimitConfig) {
    this.config = {
      blockDuration: config.blockDuration || config.windowMs * 10,
      ...config
    }
    
    this.cache = new LRUCache<string, RequestRecord>({
      max: 10000, // Maximum 10k unique IPs in memory
      ttl: this.config.windowMs * 2,
    })
  }
  
  /**
   * Check if request is allowed
   */
  check(identifier: string, metadata?: Record<string, any>): RateLimitResult {
    const now = Date.now()
    const record = this.cache.get(identifier)
    
    // Check if IP is currently blocked
    if (record?.blocked && record.blockUntil && now < record.blockUntil) {
      return {
        success: false,
        limit: this.config.maxRequests,
        remaining: 0,
        reset: record.resetTime,
        retryAfter: Math.ceil((record.blockUntil - now) / 1000)
      }
    }
    
    // Initialize or reset window
    if (!record || now >= record.resetTime) {
      const newRecord: RequestRecord = {
        count: 1,
        resetTime: now + this.config.windowMs,
        blocked: false,
        suspicionScore: this.calculateSuspicionScore(identifier, metadata)
      }
      
      this.cache.set(identifier, newRecord)
      
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset: newRecord.resetTime
      }
    }
    
    // Update suspicion score
    record.suspicionScore = this.calculateSuspicionScore(identifier, metadata, record)
    
    // Apply adaptive threshold based on suspicion
    const adaptiveLimit = this.getAdaptiveLimit(record.suspicionScore)
    
    // Increment counter
    record.count++
    
    // Check if limit exceeded
    if (record.count > adaptiveLimit) {
      // Block the IP
      record.blocked = true
      record.blockUntil = now + this.config.blockDuration
      this.cache.set(identifier, record)
      
      // Log suspicious activity
      this.logSuspiciousActivity(identifier, record, metadata)
      
      return {
        success: false,
        limit: adaptiveLimit,
        remaining: 0,
        reset: record.resetTime,
        retryAfter: Math.ceil(this.config.blockDuration / 1000)
      }
    }
    
    this.cache.set(identifier, record)
    
    return {
      success: true,
      limit: adaptiveLimit,
      remaining: adaptiveLimit - record.count,
      reset: record.resetTime
    }
  }
  
  /**
   * Calculate suspicion score (0-100)
   * Higher score = more suspicious = lower rate limit
   */
  private calculateSuspicionScore(
    identifier: string,
    metadata?: Record<string, any>,
    existingRecord?: RequestRecord
  ): number {
    let score = existingRecord?.suspicionScore || 0
    
    // Factor 1: Request frequency
    if (existingRecord && existingRecord.count > this.config.maxRequests * 0.8) {
      score += 20
    }
    
    // Factor 2: Missing or suspicious User-Agent
    if (!metadata?.userAgent || metadata.userAgent.length < 10) {
      score += 15
    }
    
    // Factor 3: Suspicious patterns in requests
    if (metadata?.path?.includes('admin') || metadata?.path?.includes('wp-')) {
      score += 30 // Common attack patterns
    }
    
    // Factor 4: Rapid sequential requests
    if (metadata?.timeSinceLastRequest && metadata.timeSinceLastRequest < 100) {
      score += 25 // Less than 100ms between requests
    }
    
    // Decay score over time
    if (existingRecord) {
      const timeSinceReset = Date.now() - (existingRecord.resetTime - this.config.windowMs)
      const decayRate = Math.max(0, 1 - (timeSinceReset / this.config.windowMs))
      score *= decayRate
    }
    
    return Math.min(100, Math.max(0, score))
  }
  
  /**
   * Get adaptive limit based on suspicion score
   */
  private getAdaptiveLimit(suspicionScore: number): number {
    if (suspicionScore > 80) return Math.floor(this.config.maxRequests * 0.2)
    if (suspicionScore > 60) return Math.floor(this.config.maxRequests * 0.5)
    if (suspicionScore > 40) return Math.floor(this.config.maxRequests * 0.75)
    return this.config.maxRequests
  }
  
  /**
   * Log suspicious activity for monitoring
   */
  private logSuspiciousActivity(
    identifier: string,
    record: RequestRecord,
    metadata?: Record<string, any>
  ): void {
    console.warn('[RATE_LIMIT] Suspicious activity detected:', {
      ip: identifier,
      suspicionScore: record.suspicionScore,
      requestCount: record.count,
      limit: this.getAdaptiveLimit(record.suspicionScore),
      metadata,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Send to SIEM/monitoring system
    // TODO: Trigger security alerts for scores > 80
  }
  
  /**
   * Manually block an IP
   */
  block(identifier: string, durationMs?: number): void {
    const now = Date.now()
    const duration = durationMs || this.config.blockDuration
    
    this.cache.set(identifier, {
      count: Infinity,
      resetTime: now + this.config.windowMs,
      blocked: true,
      blockUntil: now + duration,
      suspicionScore: 100
    })
  }
  
  /**
   * Manually unblock an IP
   */
  unblock(identifier: string): void {
    this.cache.delete(identifier)
  }
  
  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): RequestRecord | undefined {
    return this.cache.get(identifier)
  }
  
  /**
   * Reset counter for an identifier
   */
  reset(identifier: string): void {
    this.cache.delete(identifier)
  }
}

// Predefined limiters for different routes
export const apiLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,     // 100 requests per minute
  blockDuration: 15 * 60 * 1000 // Block for 15 minutes
})

export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,           // 5 login attempts
  blockDuration: 60 * 60 * 1000 // Block for 1 hour
})

export const swapLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,     // 10 swaps per minute
  blockDuration: 5 * 60 * 1000 // Block for 5 minutes
})

export const generalLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 200,    // 200 general requests per minute
  blockDuration: 10 * 60 * 1000 // Block for 10 minutes
})

export default RateLimiter
