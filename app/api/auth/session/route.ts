import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie or Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      token = authHeader?.replace('Bearer ', '');
    }

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }

    // Verify JWT
    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }

    // Get user from database
    const user = await prisma.authUser.findUnique({
      where: { id: decoded.userId },
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
