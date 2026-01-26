import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Rate Limiter Middleware
 * 
 * Prevents abuse by limiting requests per user
 * - Max 10 gasless transactions per user per day
 * - Max 100 requests per IP per hour
 */

interface RateLimitConfig {
    maxRequestsPerUser: number;
    maxRequestsPerIP: number;
    windowMs: number;
}

const config: RateLimitConfig = {
    maxRequestsPerUser: 10, // per day
    maxRequestsPerIP: 100, // per hour
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
};

// In-memory store for IP tracking (use Redis in production)
const ipStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
    address: string | null,
    ip: string | null
): Promise<{ allowed: boolean; reason?: string }> {

    // Check user-based rate limit
    if (address) {
        const oneDayAgo = new Date(Date.now() - config.windowMs);

        const userTxCount = await prisma.proposalVote.count({
            where: {
                voterAddress: address.toLowerCase(),
                votedAt: { gte: oneDayAgo },
            },
        });

        if (userTxCount >= config.maxRequestsPerUser) {
            return {
                allowed: false,
                reason: `Rate limit exceeded. Max ${config.maxRequestsPerUser} transactions per day.`,
            };
        }
    }

    // Check IP-based rate limit
    if (ip) {
        const now = Date.now();
        const ipData = ipStore.get(ip);

        if (ipData) {
            if (now < ipData.resetAt) {
                if (ipData.count >= config.maxRequestsPerIP) {
                    return {
                        allowed: false,
                        reason: "Too many requests from this IP. Try again later.",
                    };
                }
                ipData.count++;
            } else {
                // Reset window
                ipStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour
            }
        } else {
            ipStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
        }
    }

    return { allowed: true };
}

export function getClientIP(req: NextRequest): string | null {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip");
    return ip || null;
}

// Cleanup old IP entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipStore.entries()) {
        if (now > data.resetAt) {
            ipStore.delete(ip);
        }
    }
}, 60 * 60 * 1000);
