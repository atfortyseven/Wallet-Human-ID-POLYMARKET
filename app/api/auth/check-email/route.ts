import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists in AuthUser model
    const user = await prisma.authUser.findUnique({
      where: { email }
    });

    return NextResponse.json({
      exists: user !== null,
      requiresVerification: user !== null && !user.verified
    });

  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}
