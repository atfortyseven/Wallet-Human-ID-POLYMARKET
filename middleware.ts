import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'VOID_SECRET_99_POLY'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin route protection
    if (pathname.startsWith('/admin')) {
        // Allow access to admin login
        if (pathname.startsWith('/admin/login')) {
            return NextResponse.next();
        }

        // Check for admin authentication
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
        } catch (error) {
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // CORS and security logic for all routes
    const origin = request.headers.get('origin');
    const allowedOrigins = [
        'https://www.polymarketwallet.com',
        'https://polymarketwallet.com',
        'https://polymarketwallet.up.railway.app',
        'http://localhost:3000',
        'http://localhost:8080'
    ];

    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 403,
            statusText: 'Forbidden',
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

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
    response.headers.set('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: wss: data: blob:; img-src 'self' https: data: blob:; frame-ancestors 'none';");
    response.headers.set('Permissions-Policy', "camera=(), microphone=(), geolocation=()");

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
