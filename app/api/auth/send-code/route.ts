import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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

    // Create temporary user record (will be completed after verification)
    const user = await prisma.authUser.create({
      data: {
        email,
        passwordHash: '', // Will be set after verification
        verified: false
      }
    });

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt
      }
    });

    // Send verification email
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      userId: user.id
    });

  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Failed to send code' },
      { status: 500 }
    );
  }
}
