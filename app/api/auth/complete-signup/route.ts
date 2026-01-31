import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, createJWT, isValidPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Update user with password and mark as verified
    const user = await prisma.authUser.update({
      where: { email },
      data: {
        passwordHash,
        name: name || null,
        verified: true
      }
    });

    // Generate access and refresh tokens
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const { createAccessToken, createRefreshToken, setSessionCookies, generateFingerprint } = await import('@/lib/session');
    const fingerprint = generateFingerprint(userAgent, ip);
    
    const accessToken = await createAccessToken(user.id, user.email, fingerprint);
    const refreshToken = await createRefreshToken(user.id, user.email, fingerprint);

    // Set secure httpOnly cookies
    await setSessionCookies(accessToken, refreshToken);

    // Also set legacy auth_token for backward compatibility (will be removed later)
    const token = createJWT(user.id, user.email);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Complete signup error:', error);
    return NextResponse.json(
      { error: 'Failed to complete signup' },
      { status: 500 }
    );
  }
}
