/**
 * Security Headers Configuration
 * 
 * Implements enterprise-grade security headers to protect against:
 * - XSS attacks
 * - Clickjacking
 * - MIME sniffing
 * - Man-in-the-middle attacks
 */

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'Strict-Transport-Security': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'X-DNS-Prefetch-Control': string;
}

/**
 * Generates a cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
  }
  // Fallback for server-side
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Builds strict Content Security Policy
 * 
 * @param nonce - Unique nonce for inline scripts
 * @param isDev - Whether in development mode
 */
export function buildCSP(nonce?: string, isDev = false): string {
  const directives = [
    // Default: Only same origin
    "default-src 'self'",
    
    // Scripts: Self + nonce + required CDNs
    isDev 
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net" 
      : `script-src 'self' ${nonce ? `'nonce-${nonce}'` : ''} https://cdn.jsdelivr.net`,
    
    // Styles: Self + nonce + safe inline
    `style-src 'self' ${nonce ? `'nonce-${nonce}'` : ''} 'unsafe-inline' https://fonts.googleapis.com`,
    
    // Images: Self + data URLs + IPFS + common CDNs
    "img-src 'self' data: https: ipfs:",
    
    // Fonts: Self + Google Fonts
    "font-src 'self' data: https://fonts.gstatic.com",
    
    // Connect: API endpoints + Web3 providers
    "connect-src 'self' https://*.alchemy.com https://*.infura.io https://*.walletconnect.com https://*.coinbase.com wss://*.walletconnect.com",
    
    // Frames: WalletConnect + Trusted providers
    "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org",
    
    // Objects: None allowed
    "object-src 'none'",
    
    // Base URI: Self only
    "base-uri 'self'",
    
    // Form actions: Self only
    "form-action 'self'",
    
    // Frame ancestors: Prevent clickjacking
    "frame-ancestors 'none'",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests",
    
    // Block mixed content
    "block-all-mixed-content"
  ];
  
  return directives.join('; ');
}

/**
 * Gets all security headers with strict configuration
 */
export function getSecurityHeaders(nonce?: string, isDev = false): SecurityHeaders {
  return {
    // Content Security Policy
    'Content-Security-Policy': buildCSP(nonce, isDev),
    
    // HSTS: Force HTTPS for 2 years, include subdomains, allow preload
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Strict referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy - disable unnecessary features
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', '),
    
    // Disable DNS prefetching for privacy
    'X-DNS-Prefetch-Control': 'off'
  };
}

/**
 * Validates CSP header is properly configured
 */
export function validateCSP(csp: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!csp.includes("default-src 'self'")) {
    errors.push("Missing default-src 'self' directive");
  }
  
  if (!csp.includes("object-src 'none'")) {
    errors.push("Missing object-src 'none' directive");
  }
  
  if (!csp.includes("frame-ancestors 'none'")) {
    errors.push("Missing frame-ancestors 'none' directive");
  }
  
  if (csp.includes("'unsafe-eval'") && !csp.includes("script-src 'self' 'unsafe-eval'")) {
    errors.push("unsafe-eval should only be in development");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
