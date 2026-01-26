import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const proof = await req.json();
        // HARDCODE PARA EVITAR ERRORES DE ENV EN DEPLOY
        const app_id = "app_5a04351aada2559d77266326ea89ace8";
        const action = "verification-id";

        if (!app_id) {
            console.error("❌ CRITICAL: NEXT_PUBLIC_WLD_APP_ID is missing in server environment");
            return NextResponse.json({ verified: false, detail: "Server Configuration Error: Missing App ID" }, { status: 500 });
        }

        console.log(`[Verify] Calling Worldcoin API for App ID: ${app_id}`);

        const verifyRes = await fetch(`https://developer.worldcoin.org/api/v1/verify/${app_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...proof, action }),
        });

        // Check if response is JSON
        const contentType = verifyRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textHTML = await verifyRes.text();
            console.error(`❌ Worldcoin API Error (${verifyRes.status}): Received Non-JSON response.`);
            console.error(`Response preview: ${textHTML.substring(0, 200)}...`);

            return NextResponse.json({
                verified: false,
                detail: `Upstream API Error: Received ${verifyRes.status} (Non-JSON). Likely Invalid App ID or Worldcoin API is down.`
            }, { status: 502 });
        }

        const wldResponse = await verifyRes.json();

        if (verifyRes.ok) {
            return NextResponse.json({
                verified: true,
                nullifier_hash: wldResponse.nullifier_hash
            });
        } else {
            return NextResponse.json({
                verified: false,
                code: wldResponse.code,
                detail: wldResponse.detail
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("❌ Internal Verification Error:", error);
        return NextResponse.json({ verified: false, detail: error.message || "Internal Server Error" }, { status: 500 });
    }
}
