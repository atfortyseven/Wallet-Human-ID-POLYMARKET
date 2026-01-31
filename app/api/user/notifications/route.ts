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
  });

  if (!authUser) {
    return NextResponse.json({ notifications: [] });
  }

  // Fetch notifications
  let notifications = await prisma.userNotification.findMany({
    where: { authUserId: authUser.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  if (notifications.length === 0) {
      // Seed welcome notification if empty
      // In a real app we'd create this on signup
      const welcome = await prisma.userNotification.create({
          data: {
              authUserId: authUser.id,
              title: "Welcome to HumanDefi",
              message: "Your account has been successfully created. Secure your identity now.",
              type: "system",
          }
      });
      notifications = [welcome];
  }

  return NextResponse.json({ notifications });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, read } = await req.json();

    if (id) {
        await prisma.userNotification.update({
            where: { id },
            data: { read: read ?? true }
        });
    } else {
        // Mark all as read
        const authUser = await prisma.authUser.findUnique({ where: { email: session.user.email } });
        if (authUser) {
            await prisma.userNotification.updateMany({
                where: { authUserId: authUser.id, read: false },
                data: { read: true }
            });
        }
    }

    return NextResponse.json({ success: true });
}
