import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getLocationFromIP, parseUserAgent } from "@/lib/geolocation";
import { headers } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60,  // Refresh session every 24 hours
  },
  cookies: {
    sessionToken: {
      name: 'human.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Sync with AuthUser table
      try {
        const existingUser = await prisma.authUser.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.authUser.create({
            data: {
              email: user.email,
              name: user.name || profile?.name,
              verified: true, // OAuth emails are verified
              passwordHash: "oauth_google", 
            },
          });
        }
      } catch (error) {
        console.error("Error syncing AuthUser:", error);
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // On initial sign in
      if (trigger === 'signIn' || (user && account)) {
        try {
          // Generate a session ID to track this specific login
          const sessionId = crypto.randomUUID();
          token.sessionId = sessionId;

          // Gather device info
          const headersList = headers();
          const userAgent = headersList.get('user-agent') || 'Unknown';
          const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
          
          const { deviceType, browser, os } = parseUserAgent(userAgent);
          const location = await getLocationFromIP(ip);

          // Find AuthUser to link
          const authUser = await prisma.authUser.findUnique({
            where: { email: token.email! }
          });

          if (authUser) {
             await prisma.session.create({
               data: {
                 sessionToken: sessionId, // We use this internal ID as the token to track
                 authUserId: authUser.id,
                 expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                 userAgent,
                 ipAddress: ip,
                 deviceType,
                 browser,
                 os,
                 country: location.country,
                 city: location.city,
                 latitude: location.latitude,
                 longitude: location.longitude,
               }
             });
          }
        } catch (error) {
          console.error("Error creating session record:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sessionId) {
        // @ts-ignore
        session.sessionId = token.sessionId;
        
        // Verify session is still active in DB and fetch wallet info
        try {
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: token.sessionId as string },
            include: {
              authUser: {
                select: {
                    // walletAddress: true, // TEMPORARILY COMMENTED - column doesn't exist yet in production
                    name: true,
                    email: true
                }
              }
            } as any
          });
          
          if (!dbSession) {
             return {} as any; 
          }

          // @ts-ignore
          session.user = {
            ...session.user,
            // walletAddress: (dbSession as any).authUser?.walletAddress, // TEMPORARILY COMMENTED
            name: (dbSession as any).authUser?.name,
            email: (dbSession as any).authUser?.email
          } as any;
          
          const now = new Date();
          if (dbSession.lastActivity.getTime() < now.getTime() - 5 * 60 * 1000) { 
             await prisma.session.update({
               where: { id: dbSession.id },
               data: { lastActivity: now }
             });
          }
        } catch(e) {
             console.error("Session verification failed", e);
        }
      }
      return session;
    },
  },
};

// ========================================
// Authentication Helper Functions
// ========================================

import bcrypt from 'bcryptjs';

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: min 8 chars, uppercase, lowercase, number
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

/**
 * Create a legacy JWT token (for backward compatibility)
 * @deprecated Use createAccessToken and createRefreshToken from lib/session instead
 * This is a temporary compatibility shim until we migrate all endpoints to the new session system
 */
export function createJWT(userId: string, email: string): string {
  // Simple base64-encoded token for legacy compatibility
  // This is NOT secure for production use long-term, but prevents immediate signup failures
  const payload = {
    userId,
    email,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

