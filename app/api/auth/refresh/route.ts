import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createAccessToken, createRefreshToken, setSessionCookies, generateFingerprint, validateFingerprint } from '@/lib/session';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('human.refresh-token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token found' },
                { status: 401 }
            );
        }

        // Verify refresh token
        const payload = await verifyToken(refreshToken);

        if (!payload || payload.type !== 'refresh') {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        // Validate device fingerprint
        const userAgent = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const currentFingerprint = generateFingerprint(userAgent, ip);

        if (payload.fingerprint && !validateFingerprint(payload.fingerprint, currentFingerprint)) {
            return NextResponse.json(
                { error: 'Device fingerprint mismatch' },
                { status: 403 }
            );
        }

        // Generate new tokens (refresh token rotation)
        const newAccessToken = await createAccessToken(payload.userId, payload.email, currentFingerprint);
        const newRefreshToken = await createRefreshToken(payload.userId, payload.email, currentFingerprint);

        // Set new cookies
        await setSessionCookies(newAccessToken, newRefreshToken);

        return NextResponse.json({
            success: true,
            message: 'Token refreshed successfully'
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}
