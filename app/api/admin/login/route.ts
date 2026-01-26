import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "VOID_SECRET_99_POLY"
);

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await AdminUser.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create JWT token
        const token = await new SignJWT({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                email: user.email,
                role: user.role,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error("[Admin Login] Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
