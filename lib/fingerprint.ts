import crypto from 'crypto';
import { NextRequest } from 'next/server';

/**
 * Generate a browser fingerprint based on multiple HTTP headers
 * This creates a unique hash that identifies the browser characteristics
 */
export function generateFingerprint(request: NextRequest): string {
    const components = [
        request.headers.get('user-agent'),
        request.headers.get('accept-language'),
        request.headers.get('accept-encoding'),
        request.headers.get('sec-ch-ua'),
        request.headers.get('sec-ch-ua-platform'),
    ];

    // Filter out null values and join with delimiter
    const fingerprintString = components.filter(Boolean).join('|');

    // Generate SHA-256 hash
    return crypto.createHash('sha256').update(fingerprintString).digest('hex');
}

/**
 * Extract IP address from request headers
 * Handles proxies and load balancers
 */
export function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, get the first one
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}
