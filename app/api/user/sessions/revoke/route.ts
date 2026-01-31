import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  // Find AuthUser
  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
  });

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership and delete
  await prisma.session.deleteMany({
    where: {
      sessionToken: sessionId, // Our internal ID
      authUserId: authUser.id,
    }
  });

  return NextResponse.json({ success: true });
}
