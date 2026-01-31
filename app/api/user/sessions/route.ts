import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find AuthUser
  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
  });

  if (!authUser) {
    return NextResponse.json({ sessions: [] });
  }

  const sessions = await prisma.session.findMany({
    where: { authUserId: authUser.id },
    orderBy: { lastActivity: 'desc' },
  });

  return NextResponse.json({
    sessions: sessions.map(s => ({
      id: s.id,
      sessionToken: s.sessionToken, // Internal ID we used
      device: `${s.deviceType || 'Unknown'} - ${s.os || 'Unknown'}`,
      browser: s.browser || 'Unknown',
      location: `${s.city || 'Unknown'}, ${s.country || 'Unknown'}`,
      ip: s.ipAddress,
      lastActive: s.lastActivity,
      current: s.sessionToken === (session as any).sessionId // access custom field
    }))
  });
}
