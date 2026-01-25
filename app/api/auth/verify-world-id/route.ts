import { NextResponse } from "next/server";

// IMPORTANTE: NO importes nada de @worldcoin/idkit aquí.
// NO importes componentes de React.
// SOLO librerías de servidor o tipos.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("DEBUG: Verification Request Body:", JSON.stringify(body).slice(0, 100) + "...");

        const { proof, signal, merkle_root, nullifier_hash, verification_level, action } = body;

        // 0. BYPASS DE EMERGENCIA
        // Chequeamos si la variable existe y si, al normalizarla, es 'true'
        const bypassVar = process.env.BYPASS_WORLD_ID?.toLowerCase().trim();
        if (bypassVar === "true" || bypassVar === "1") {
            console.log("⚠️ BYPASS_WORLD_ID enabled. Skipping verification.");
            return NextResponse.json({
                success: true,
                verified: true,
                nullifier_hash: "bypass-hash-" + Date.now()
            });
        }

        // 1. Validar que los datos existen
        if (!proof || !merkle_root || !nullifier_hash) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // 2. Verificar la prueba con la API de Worldcoin (Server-to-Server)
        // Usamos trim() para evitar errores por espacios en blanco accidentales al copiar/pegar
        const raw_app_id = process.env.WLD_APP_ID || process.env.NEXT_PUBLIC_WLD_APP_ID || "";
        const app_id = raw_app_id.trim();
        const action_id = (process.env.NEXT_PUBLIC_WLD_ACTION || "").trim();

        // DEBUG: Logging para encontrar el error en Railway
        console.log("--- World ID Verification Debug ---");
        console.log("App ID (processed):", app_id ? `${app_id.substring(0, 6)}...` : "UNDEFINED");
        console.log("Action ID (processed):", action_id);
        console.log("Target URL:", `https://developer.worldcoin.org/api/v1/verify/${app_id}`);

        if (!app_id) {
            console.error("CRITICAL: WLD_APP_ID is missing or empty.");
            return NextResponse.json(
                { error: "Server Configuration Error: Missing WLD_APP_ID" },
                { status: 500 }
            );
        }

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

        // LEEMOS TEXTO PRIMERO (Para evitar el crash "Unexpected token <")
        const rawBody = await verifyRes.text();
        console.log("Worldcoin API Raw Status:", verifyRes.status);

        let wldResponse;
        try {
            wldResponse = JSON.parse(rawBody);
        } catch (e) {
            console.error("CRITICAL: Worldcoin API returned non-JSON. Likely HTML error page.");
            console.error("Raw Body Preview:", rawBody.slice(0, 500));
            return NextResponse.json(
                {
                    error: "Upstream API Error (Non-JSON)",
                    details: "The Worldcoin API returned HTML instead of JSON. Check App ID.",
                    raw_preview: rawBody.slice(0, 200),
                    status: verifyRes.status
                },
                { status: 502 }
            );
        }

        if (!verifyRes.ok) {
            console.error("Worldcoin API Error Response (Parsed):", JSON.stringify(wldResponse, null, 2));
            return NextResponse.json(
                {
                    error: "Worldcoin Verification Failed",
                    details: wldResponse,
                    status: verifyRes.status
                },
                { status: 400 }
            );
        }

        console.log("Worldcoin Verification Success!");

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
