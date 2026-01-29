import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type SecurityEventType =
    | 'LOGIN'
    | 'LOGOUT'
    | 'IP_CHANGE'
    | 'FINGERPRINT_MISMATCH'
    | 'RATE_LIMIT'
    | 'BLOCKED'
    | 'FAILED_LOGIN';

export type SecurityEventSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

interface LogSecurityEventParams {
    type: SecurityEventType;
    userId?: string;
    ipAddress: string;
    userAgent?: string;
    severity: SecurityEventSeverity;
    metadata?: Record<string, any>;
}

/**
 * Log a security event to the database
 */
export async function logSecurityEvent(params: LogSecurityEventParams): Promise<void> {
    try {
        await prisma.securityEvent.create({
            data: {
                type: params.type,
                userId: params.userId,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                severity: params.severity,
                metadata: params.metadata || {},
            },
        });
    } catch (error) {
        console.error('Failed to log security event:', error);
        // Don't throw - logging failures shouldn't break the auth flow
    }
}

/**
 * Check if an IP address is blocked
 */
export async function checkBlockedIP(ipAddress: string): Promise<boolean> {
    try {
        const blocked = await prisma.blockedIP.findUnique({
            where: { ipAddress },
        });

        if (!blocked) {
            return false;
        }

        // Check if block has expired
        if (blocked.expiresAt && blocked.expiresAt < new Date()) {
            // Remove expired block
            await prisma.blockedIP.delete({
                where: { ipAddress },
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to check blocked IP:', error);
        return false; // Fail open - don't block on error
    }
}

/**
 * Block an IP address
 */
export async function blockIP(
    ipAddress: string,
    reason: string,
    expiresAt?: Date
): Promise<void> {
    try {
        await prisma.blockedIP.upsert({
            where: { ipAddress },
            create: {
                ipAddress,
                reason,
                expiresAt,
            },
            update: {
                reason,
                expiresAt,
                blockedAt: new Date(),
            },
        });

        await logSecurityEvent({
            type: 'BLOCKED',
            ipAddress,
            severity: 'CRITICAL',
            metadata: { reason, expiresAt },
        });
    } catch (error) {
        console.error('Failed to block IP:', error);
    }
}

/**
 * Detect brute force attacks and auto-block IPs
 * Returns true if IP should be blocked
 */
export async function detectBruteForce(
    ipAddress: string,
    threshold: number = 5,
    timeWindowMinutes: number = 15
): Promise<boolean> {
    try {
        const since = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

        const failedAttempts = await prisma.securityEvent.count({
            where: {
                type: 'FAILED_LOGIN',
                ipAddress,
                timestamp: { gte: since },
            },
        });

        if (failedAttempts >= threshold) {
            // Auto-block for 1 hour
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            await blockIP(
                ipAddress,
                `Brute force detected: ${failedAttempts} failed login attempts`,
                expiresAt
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error('Failed to detect brute force:', error);
        return false;
    }
}
