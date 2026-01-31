import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find AuthUser
  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
  });

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get current session ID to exclude
  const currentSessionId = (session as any).sessionId;

  // Revoke all except current
  await prisma.session.deleteMany({
    where: {
      authUserId: authUser.id,
      sessionToken: {
        not: currentSessionId // Keep current session
      }
    }
  });

  return NextResponse.json({ success: true });
}
