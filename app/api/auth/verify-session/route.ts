import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

/**
 * GET /api/auth/verify-session
 * Verify if user has a valid session
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (session) {
            return NextResponse.json({
                authenticated: true,
                user: {
                    userId: session.userId,
                    email: session.email
                }
            });
        }

        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        );

    } catch (error) {
        console.error('Session verification error:', error);
        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}
