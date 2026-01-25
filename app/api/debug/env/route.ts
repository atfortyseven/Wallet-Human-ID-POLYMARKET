import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        WLD_APP_ID: process.env.WLD_APP_ID ? "SET" : "MISSING",
        NEXT_PUBLIC_WLD_APP_ID: process.env.NEXT_PUBLIC_WLD_APP_ID ? "SET" : "MISSING",
        NEXT_PUBLIC_WLD_ACTION: process.env.NEXT_PUBLIC_WLD_ACTION ? "SET" : "MISSING",
        NODE_ENV: process.env.NODE_ENV,
        BYPASS_WORLD_ID: process.env.BYPASS_WORLD_ID,
    });
}
