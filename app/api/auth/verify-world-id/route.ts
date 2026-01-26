import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWorldIDProof } from "@/lib/worldid";
import { cookies } from "next/headers";
import { SignJWT } from "jose"; // Necesitaremos 'jose' para JWT (o jsonwebtoken)

const prisma = new PrismaClient();

// Secret para JWT (Debería estar en env, usamos un fallback seguro para dev)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { proof, walletAddress } = body;

        // 1. Validar input básico
        if (!proof || !proof.nullifier_hash) {
            return NextResponse.json(
                { error: "Missing proof data" },
                { status: 400 }
            );
        }

        // 2. Verificar la prueba con Worldcoin (Logic Step 2)
        const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as string;
        const action = "login"; // Debe coincidir con el frontend

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
            return NextResponse.json(
                { error: "Invalid World ID proof", detail: verifyRes.detail },
                { status: 401 }
            );
        }

        const nullifierHash = proof.nullifier_hash;

        // 3. Lógica de Usuario y Base de Datos (Logic Step 3)

        // A) Buscar usuario por nullifier_hash
        let user = await prisma.user.findUnique({
            where: { worldIdNullifierHash: nullifierHash },
        });

        // B) Escenario Migración: No existe por nullifier, intentamos linkear si hay wallet
        if (!user) {
            if (walletAddress) {
                // Buscamos si el usuario existe por wallet
                const existingUserByWallet = await prisma.user.findUnique({
                    where: { walletAddress: walletAddress },
                });

                if (existingUserByWallet) {
                    // LINK: Actualizamos el usuario existente con el nullifier
                    if (existingUserByWallet.worldIdNullifierHash && existingUserByWallet.worldIdNullifierHash !== nullifierHash) {
                        // PRECAUCIÓN: Ya tiene otro World ID. Política: Rechazar o Sobreescribir?
                        // Por seguridad, rechazamos el hijacking.
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
                    // CREATE: Nuevo usuario (SignUp)
                    user = await prisma.user.create({
                        data: {
                            walletAddress: walletAddress, // Requerido por schema
                            worldIdNullifierHash: nullifierHash,
                        },
                    });

                    // Inicializar métricas
                    await prisma.userMetrics.create({
                        data: { userAddress: walletAddress }
                    });
                }
            } else {
                // No user found, and no wallet provided to create one
                return NextResponse.json(
                    { error: "User not found. Please connect wallet to sign up." },
                    { status: 404 }
                );
            }
        }

        // 4. Generar Session Token (JWT)
        // Usamos 'jose' para un entorno edge-friendly si fuera necesario
        const token = await new SignJWT({
            sub: user.walletAddress,
            nullifier: user.worldIdNullifierHash
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Establecer cookie (opcional, o devolver en body)
        cookies().set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
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
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
