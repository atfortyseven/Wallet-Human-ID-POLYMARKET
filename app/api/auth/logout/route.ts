import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { clearSessionCookies } from "@/lib/session";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (token) {
        try {
            // Verify and extract session ID from JWT
            const verified = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
            const sessionId = verified.payload.sessionId as string;

            // Delete session from database
            if (sessionId) {
                await prisma.session.delete({
                    where: { id: sessionId }
                }).catch(() => {
                    // Session might already be deleted, ignore error
                });
            }
        } catch (error) {
            // Token invalid, but we still clear the cookie
            console.log("Logout: Invalid token or session already expired");
        }
    }

    // Clear all session cookies (legacy + new dual-token system)
    await clearSessionCookies();
    
    cookieStore.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: "/",
        maxAge: 0, // Immediately expire
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
}
