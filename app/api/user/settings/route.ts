import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
    include: { userSettings: true }
  });

  if (!authUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return settings or defaults
  return NextResponse.json({
    settings: authUser.userSettings || {}
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Find AuthUser
  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
  });

  if (!authUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Upsert settings
  const settings = await prisma.userSettings.upsert({
    where: { authUserId: authUser.id },
    update: {
      ...data,
      updatedAt: new Date()
    },
    create: {
      authUserId: authUser.id,
      ...data
    }
  });

  return NextResponse.json({ success: true, settings });
}
