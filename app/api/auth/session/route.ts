import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { sessionRateLimiter } from "@/lib/ratelimit";
import { generateFingerprint, getClientIP } from "@/lib/fingerprint";
import { logSecurityEvent } from "@/lib/security";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 🛡️ SECURITY: Rate limiting (60 requests/minute)
    const rateLimitResult = await sessionRateLimiter.check(60, ipAddress);
    if (!rateLimitResult.success) {
        return NextResponse.json(
            { authenticated: false, reason: 'Rate limit exceeded' },
            { status: 429 }
        );
    }

    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        // 1. Verify JWT signature
        const verified = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
        const payload = verified.payload;

        // 2. Extract session ID from JWT
        const sessionId = payload.sessionId as string;

        if (!sessionId) {
            return NextResponse.json({ authenticated: false, reason: 'No session ID' }, { status: 401 });
        }

        // 3. Verify session exists in database
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { user: true }
        });

        if (!session) {
            return NextResponse.json({ authenticated: false, reason: 'Session not found' }, { status: 401 });
        }

        // 4. Check if session has expired
        if (session.expiresAt < new Date()) {
            // Cleanup expired session
            await prisma.session.delete({ where: { id: sessionId } });
            return NextResponse.json({ authenticated: false, reason: 'Session expired' }, { status: 401 });
        }

        // 5. Check if session is already marked as compromised
        if (session.isCompromised) {
            await logSecurityEvent({
                type: 'BLOCKED',
                userId: session.userId,
                ipAddress,
                userAgent,
                severity: 'CRITICAL',
                metadata: { reason: 'Attempted to use compromised session', sessionId },
            });

            return NextResponse.json({ authenticated: false, reason: 'Session compromised' }, { status: 401 });
        }

        // 🛡️ SECURITY LAYER: Browser fingerprint validation
        const currentFingerprint = generateFingerprint(request);
        if (session.fingerprint && session.fingerprint !== currentFingerprint) {
            // Fingerprint mismatch - possible session hijacking
            await prisma.session.update({
                where: { id: sessionId },
                data: { isCompromised: true }
            });

            await logSecurityEvent({
                type: 'FINGERPRINT_MISMATCH',
                userId: session.userId,
                ipAddress,
                userAgent,
                severity: 'CRITICAL',
                metadata: {
                    sessionId,
                    storedFingerprint: session.fingerprint,
                    currentFingerprint,
                },
            });

            return NextResponse.json(
                { authenticated: false, reason: 'Session security violation detected' },
                { status: 401 }
            );
        }

        // 🛡️ SECURITY LAYER: IP change detection
        if (session.ipAddress && session.ipAddress !== ipAddress) {
            // IP changed - log as suspicious but allow with warning
            await logSecurityEvent({
                type: 'IP_CHANGE',
                userId: session.userId,
                ipAddress,
                userAgent,
                severity: 'WARNING',
                metadata: {
                    sessionId,
                    oldIP: session.ipAddress,
                    newIP: ipAddress,
                },
            });

            // Mark session as compromised for stricter security
            await prisma.session.update({
                where: { id: sessionId },
                data: { isCompromised: true }
            });

            return NextResponse.json(
                { authenticated: false, reason: 'IP address changed. Please re-authenticate.' },
                { status: 401 }
            );
        }

        // 🛡️ SECURITY LAYER: User-Agent validation (less strict, just log)
        if (session.userAgent && session.userAgent !== userAgent) {
            await logSecurityEvent({
                type: 'FINGERPRINT_MISMATCH',
                userId: session.userId,
                ipAddress,
                userAgent,
                severity: 'INFO',
                metadata: {
                    sessionId,
                    oldUserAgent: session.userAgent,
                    newUserAgent: userAgent,
                    type: 'user_agent_change',
                },
            });
        }

        // 6. Update last activity timestamp
        await prisma.session.update({
            where: { id: sessionId },
            data: { lastActivity: new Date() }
        });

        // 7. Return authenticated status with user data
        return NextResponse.json({
            authenticated: true,
            user: {
                address: session.user.walletAddress,
                tier: session.user.tier,
            }
        });

    } catch (error) {
        console.error("Session validation error:", error);
        return NextResponse.json({ authenticated: false, reason: 'Invalid token' }, { status: 401 });
    }
}
