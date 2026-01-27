import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
        return NextResponse.json({ authenticated: true });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
