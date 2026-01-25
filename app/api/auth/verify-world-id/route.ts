import { type NextRequest, NextResponse } from "next/server";
import { verifyCloudProof } from "@worldcoin/idkit";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

// Secret key for JWT (Should be in env, using fallback for dev)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "super_secret_session_key_12345"
);

export async function POST(req: NextRequest) {
    try {
        const { proof, merkle_root, nullifier_hash, verification_level, wallet_address } = await req.json();

        // 1. Verify with World ID API
        const verifyRes = await verifyCloudProof(
            { proof, merkle_root, nullifier_hash, verification_level },
            process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`, // App ID
            "verify-identity" // Action Name (Must match Protocol Portal)
        );

        if (!verifyRes.success) {
            return NextResponse.json({ error: "Invalid World ID Proof" }, { status: 400 });
        }

        // 2. Check Sybil Resistance (Nullifier Uniqueness)
        const existingUser = await prisma.user.findUnique({
            where: { worldIdNullifierHash: nullifier_hash },
        });

        if (existingUser) {
            if (existingUser.walletAddress !== wallet_address) {
                return NextResponse.json(
                    { error: "This World ID is already registered to another wallet." },
                    { status: 409 }
                );
            }
            // User verify again (Login flow) - Allow
        } else {
            // 3. Register New User
            await prisma.user.create({
                data: {
                    walletAddress: wallet_address,
                    worldIdNullifierHash: nullifier_hash,
                },
            });
        }

        // 4. Create Session (JWT)
        const token = await new SignJWT({ sub: wallet_address, verified: true })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        const response = NextResponse.json({ success: true });

        // Set HTTP-Only Cookie
        response.cookies.set({
            name: "human_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
