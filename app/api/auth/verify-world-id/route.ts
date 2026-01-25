import { NextResponse } from "next/server";

// IMPORTANTE: NO importes nada de @worldcoin/idkit aquí.
// NO importes componentes de React.
// SOLO librerías de servidor o tipos.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { proof, signal, merkle_root, nullifier_hash, verification_level, action } = body;

        // 1. Validar que los datos existen
        if (!proof || !merkle_root || !nullifier_hash) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // 2. Verificar la prueba con la API de Worldcoin (Server-to-Server)
        const app_id = process.env.WLD_APP_ID;
        const action_id = process.env.NEXT_PUBLIC_WLD_ACTION || "";

        // URL de verificación oficial de Worldcoin
        const verifyRes = await fetch(
            `https://developer.worldcoin.org/api/v1/verify/${app_id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: action_id, // Asegúrate de que coincida con lo que pusiste en el frontend
                    signal: signal,    // A veces signal se envía vacío o como string
                    proof,
                    merkle_root,
                    nullifier_hash,
                    verification_level,
                }),
            }
        );

        const wldResponse = await verifyRes.json();

        if (!verifyRes.ok) {
            console.error("Worldcoin Validation Error:", wldResponse);
            return NextResponse.json(
                { error: "Invalid Proof", details: wldResponse },
                { status: 400 }
            );
        }

        // 3. (Opcional) Guardar en Base de Datos con Prisma
        // Si vas a usar Prisma aquí, asegúrate de importar 'prisma' desde tu lib instanciada, no crear una nueva instancia.
        // import prisma from '@/lib/prisma';

        // Por ahora, devolvemos éxito para que el build pase
        return NextResponse.json({
            success: true,
            verified: true,
            nullifier_hash
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
