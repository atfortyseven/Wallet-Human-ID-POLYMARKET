import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export function rateLimit(options?: RateLimitOptions) {
    const tokenCache = new LRUCache<string, number[]>({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000, // Default 1 minute
    });

    return {
        check: async (limit: number, token: string): Promise<{ success: boolean; remaining: number }> => {
            const tokenCount = tokenCache.get(token) || [0];

            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }

            tokenCount[0] += 1;
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;

            return {
                success: !isRateLimited,
                remaining: Math.max(0, limit - currentUsage),
            };
        },
    };
}

// Predefined rate limiters for different endpoints
export const loginRateLimiter = rateLimit({
    uniqueTokenPerInterval: 500,
    interval: 15 * 60 * 1000, // 15 minutes
});

export const sessionRateLimiter = rateLimit({
    uniqueTokenPerInterval: 500,
    interval: 60 * 1000, // 1 minute
});

export const logoutRateLimiter = rateLimit({
    uniqueTokenPerInterval: 500,
    interval: 60 * 1000, // 1 minute
});
