import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { logoutRateLimiter } from "@/lib/ratelimit";
import { getClientIP } from "@/lib/fingerprint";
import { logSecurityEvent } from "@/lib/security";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 🛡️ SECURITY: Rate limiting (10 requests/minute)
    const rateLimitResult = await logoutRateLimiter.check(10, ipAddress);
    if (!rateLimitResult.success) {
        return NextResponse.json(
            { success: false, message: 'Rate limit exceeded' },
            { status: 429 }
        );
    }

    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (token) {
        try {
            // Verify and extract session ID from JWT
            const verified = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
            const sessionId = verified.payload.sessionId as string;
            const userId = verified.payload.sub as string;

            // Delete session from database
            if (sessionId) {
                await prisma.session.delete({
                    where: { id: sessionId }
                }).catch(() => {
                    // Session might already be deleted, ignore error
                });
            }

            // 🛡️ SECURITY: Log logout event
            await logSecurityEvent({
                type: 'LOGOUT',
                userId,
                ipAddress,
                userAgent,
                severity: 'INFO',
                metadata: { sessionId },
            });

        } catch (error) {
            // Token invalid, but we still clear the cookie
            console.log("Logout: Invalid token or session already expired");
        }
    }

    // Clear auth cookie
    cookies().set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: "/",
        maxAge: 0, // Immediately expire
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
}
