import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
        'https://polymarketwallet.up.railway.app',
        'http://localhost:3000' // Keep localhost for dev
    ];

    // Check if origin is allowed
    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 403,
            statusText: 'Forbidden',
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Standard response for allowed origins or no-origin (server-side/navigation)
    const response = NextResponse.next();

    // Set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Geo-Block logic (Compliance)
    const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || 'XX';
    if (country === 'US') {
        // return new NextResponse('Access Denied: Service not available in your region.', { status: 403 });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
