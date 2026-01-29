import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWorldIDProof } from "@/lib/worldid";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { loginRateLimiter } from "@/lib/ratelimit";
import { generateFingerprint, getClientIP } from "@/lib/fingerprint";
import { logSecurityEvent, checkBlockedIP, detectBruteForce } from "@/lib/security";
import { worldIdProofSchema } from "@/lib/validation";

const prisma = new PrismaClient();

// Secret para JWT (Debería estar en env, usamos un fallback seguro para dev)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";

export async function POST(request: NextRequest) {
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    try {
        // 🛡️ SECURITY LAYER 1: Check if IP is blocked
        const isBlocked = await checkBlockedIP(ipAddress);
        if (isBlocked) {
            await logSecurityEvent({
                type: 'BLOCKED',
                ipAddress,
                userAgent,
                severity: 'CRITICAL',
                metadata: { reason: 'Blocked IP attempted login' },
            });

            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }

        // 🛡️ SECURITY LAYER 2: Rate limiting (5 attempts per 15 minutes)
        const rateLimitResult = await loginRateLimiter.check(5, ipAddress);
        if (!rateLimitResult.success) {
            await logSecurityEvent({
                type: 'RATE_LIMIT',
                ipAddress,
                userAgent,
                severity: 'WARNING',
                metadata: { endpoint: '/api/auth/verify-world-id', remaining: rateLimitResult.remaining },
            });

            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { proof, walletAddress } = body;

        // 🛡️ SECURITY LAYER 3: Input validation with Zod
        try {
            worldIdProofSchema.parse(body);
        } catch (validationError: any) {
            await logSecurityEvent({
                type: 'FAILED_LOGIN',
                ipAddress,
                userAgent,
                severity: 'INFO',
                metadata: { reason: 'Invalid input format', errors: validationError.errors },
            });

            return NextResponse.json(
                { error: "Invalid request format", details: validationError.errors },
                { status: 400 }
            );
        }

        // 2. Verificar la prueba con Worldcoin
        const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID || process.env.WLD_APP_ID || "app_d2014c58bb084dcb09e1f3c1c1144287";
        const action = "login";

        console.log("Verifying World ID with:", { app_id, action, hasProof: !!proof });

        const verifyRes = await verifyWorldIDProof(
            {
                proof: proof.proof,
                merkle_root: proof.merkle_root,
                nullifier_hash: proof.nullifier_hash,
                verification_level: proof.verification_level,
            },
            app_id,
            action
        );

        if (!verifyRes.success) {
            console.error("World ID Verification failed:", verifyRes);

            // 🛡️ SECURITY: Log failed login attempt
            await logSecurityEvent({
                type: 'FAILED_LOGIN',
                ipAddress,
                userAgent,
                severity: 'WARNING',
                metadata: { reason: 'Invalid World ID proof', detail: verifyRes.detail },
            });

            // 🛡️ SECURITY: Check for brute force attack
            const shouldBlock = await detectBruteForce(ipAddress);
            if (shouldBlock) {
                return NextResponse.json(
                    { error: "Too many failed attempts. Your IP has been temporarily blocked." },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: "Invalid World ID proof", detail: verifyRes.detail },
                { status: 401 }
            );
        }

        const nullifierHash = proof.nullifier_hash;

        // 3. Lógica de Usuario y Base de Datos
        let user = await prisma.user.findUnique({
            where: { worldIdNullifierHash: nullifierHash },
        });

        if (!user) {
            if (walletAddress) {
                const existingUserByWallet = await prisma.user.findUnique({
                    where: { walletAddress: walletAddress },
                });

                if (existingUserByWallet) {
                    if (existingUserByWallet.worldIdNullifierHash && existingUserByWallet.worldIdNullifierHash !== nullifierHash) {
                        return NextResponse.json(
                            { error: "Wallet already linked to another World ID" },
                            { status: 409 }
                        );
                    }

                    user = await prisma.user.update({
                        where: { walletAddress: walletAddress },
                        data: { worldIdNullifierHash: nullifierHash },
                    });
                } else {
                    user = await prisma.user.create({
                        data: {
                            walletAddress: walletAddress,
                            worldIdNullifierHash: nullifierHash,
                        },
                    });

                    await prisma.userMetrics.create({
                        data: { userAddress: walletAddress }
                    });
                }
            } else {
                const tempWalletAddress = `worldid_${nullifierHash.slice(0, 16)}`;

                user = await prisma.user.create({
                    data: {
                        walletAddress: tempWalletAddress,
                        worldIdNullifierHash: nullifierHash,
                    },
                });

                await prisma.userMetrics.create({
                    data: { userAddress: tempWalletAddress }
                });
            }
        }

        // 🛡️ SECURITY LAYER 4: Generate browser fingerprint
        const fingerprint = generateFingerprint(request);

        // 4. Create Session in Database with fingerprint
        const sessionToken = crypto.randomUUID(); // Secure random session ID
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Create session record with fingerprint
        const session = await prisma.session.create({
            data: {
                userId: user.walletAddress,
                sessionToken,
                expiresAt,
                ipAddress,
                userAgent,
                fingerprint, // 🛡️ Store fingerprint for session hijacking detection
            }
        });

        // 5. Generate JWT with session token (1 hour expiration)
        const token = await new SignJWT({
            sub: user.walletAddress,
            nullifier: user.worldIdNullifierHash,
            sessionId: session.id, // Link to database session
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h') // Changed from 24h to 1h
            .sign(new TextEncoder().encode(JWT_SECRET));

        // 6. Set SESSION cookie (expires when browser closes)
        cookies().set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // NO maxAge = session cookie, expires when browser closes
            sameSite: 'lax', // CSRF protection
            path: "/",
        });

        // 🛡️ SECURITY: Log successful login
        await logSecurityEvent({
            type: 'LOGIN',
            userId: user.walletAddress,
            ipAddress,
            userAgent,
            severity: 'INFO',
            metadata: { sessionId: session.id, fingerprint },
        });

        return NextResponse.json({
            success: true,
            token: token,
            user: {
                address: user.walletAddress,
                verified: true
            }
        });

    } catch (error) {
        console.error("Auth Error:", error);

        // 🛡️ SECURITY: Log system errors
        await logSecurityEvent({
            type: 'FAILED_LOGIN',
            ipAddress,
            userAgent,
            severity: 'CRITICAL',
            metadata: { reason: 'System error', error: String(error) },
        });

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
