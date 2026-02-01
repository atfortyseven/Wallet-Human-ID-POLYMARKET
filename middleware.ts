import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSecurityHeaders, generateNonce } from '@/lib/security/csp-config'

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
  // Generate unique nonce for this request
  const nonce = generateNonce()
  
  // Get security headers
  const isDev = process.env.NODE_ENV === 'development'
  const securityHeaders = getSecurityHeaders(nonce, isDev)
  
  // Create response
  const response = NextResponse.next()
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Remove sensitive headers that leak information
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')
  
  // Set nonce in response for use in document
  response.headers.set('X-Nonce', nonce)
  
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
