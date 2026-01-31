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
        
        // Verify session is still active in DB (Revocation check)
        try {
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: token.sessionId as string }
          });
          
          if (!dbSession) {
             // Session revoked
             // returning null or empty session forces logout in client
             return {} as any; 
          }
          
          // Update last active (debounced/occasional)
          // We can do this here or in middleware. Doing it here is safer for runtime.
          const now = new Date();
          if (dbSession.lastActivity.getTime() < now.getTime() - 5 * 60 * 1000) { // 5 min debounce
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
