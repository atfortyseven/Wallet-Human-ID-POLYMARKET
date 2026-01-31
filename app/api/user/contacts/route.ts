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
    return NextResponse.json({ contacts: [] });
  }

  const contacts = await prisma.userContact.findMany({
    where: { authUserId: authUser.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ contacts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
  });

  if (!authUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { name, walletAddress, email, notes, tags, favorite } = await req.json();

  if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const contact = await prisma.userContact.create({
    data: {
        authUserId: authUser.id,
        name,
        walletAddress,
        email,
        notes,
        tags: tags || [],
        favorite: favorite || false
    }
  });

  return NextResponse.json({ success: true, contact });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Ensure contact belongs to user
    const contact = await prisma.userContact.findUnique({
        where: { id },
        include: { authUser: true }
    });

    if (!contact || contact.authUser.email !== session.user.email) {
        return NextResponse.json({ error: "Contact not found or unauthorized" }, { status: 404 });
    }

    await prisma.userContact.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
