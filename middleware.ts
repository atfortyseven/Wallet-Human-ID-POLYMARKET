import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/dashboard(.*)',
  '/mercados(.*)',
  '/favorites(.*)',
  '/tokenomics(.*)',
  '/developer(.*)',
  '/funciones(.*)',
  '/soporte(.*)',
  '/vip(.*)',
  '/wallet(.*)',
  '/desarrollador(.*)',
  '/settings(.*)',
])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Create response
  const response = NextResponse.next()
  
  // Apply critical security headers (without CSP nonce for now)
  const isDev = process.env.NODE_ENV === 'development'
  
  // Simplified security headers without nonce
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Permissions policy
  response.headers.set('Permissions-Policy', [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '))
  
  // Remove sensitive headers
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')
  
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
  
  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
