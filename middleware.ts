import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Simple Geo-Block for US (Compliance)
    // Note: 'geo' property is available on Vercel/some edge providers. 
    // For local/Railway without specific headers, this might default to undefined.
    // We check for 'x-vercel-ip-country' or similar headers common in proxies if available.

    const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || 'XX';

    if (country === 'US') {
        return new NextResponse('Access Denied: Service not available in your region.', { status: 403 });
    }

    return NextResponse.next();
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
