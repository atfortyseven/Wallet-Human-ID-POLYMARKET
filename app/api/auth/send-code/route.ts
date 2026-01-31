import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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

    console.log(`[Auth] Attempting to send code to: ${email}`);

    // Create or update AuthUser
    // We use upsert to handle cases where the user might already exist but not be verified
    const user = await prisma.authUser.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: '',
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
    try {
        await sendVerificationEmail(email, code);
        console.log(`[Auth] Code sent successfully to: ${email}`);
    } catch (emailError: any) {
        console.error('[Auth] Failed to send email via Resend:', emailError?.message || emailError);
        // We throw to catch it in the outer block and return 500
        throw new Error(`Email sending failed: ${emailError?.message || 'Unknown error'}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      userId: user.id
    });

  } catch (error: any) {
    console.error('[Auth] Send code general error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send code' },
      { status: 500 }
    );
  }
}
