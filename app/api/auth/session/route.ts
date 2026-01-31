import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }

    // Get user from database
    const user = await prisma.authUser.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }

    return NextResponse.json({
      authenticated: true,
      user
    });

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({
      authenticated: false,
      user: null
    });
  }
}
