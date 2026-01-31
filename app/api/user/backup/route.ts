import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUser = await prisma.authUser.findUnique({
    where: { email: session.user.email },
    include: {
        userSettings: true,
        contacts: true
    }
  });

  if (!authUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate Backup Payload
  const backupPayload = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      user: {
          email: authUser.email,
          name: authUser.name,
      },
      settings: authUser.userSettings,
      contacts: authUser.contacts,
  };

  // Logic to 'save' would go here if we were storing on server, 
  // but for Cloud Sync we usually return to client to upload to specific cloud 
  // OR we use server-side tokens to upload directly using Google SDK.

  // Updating last backup timestamp
  if (authUser.userSettings) {
      await prisma.userSettings.update({
          where: { id: authUser.userSettings.id },
          data: { lastBackupAt: new Date() }
      });
  }

  return NextResponse.json({ 
      success: true, 
      size: JSON.stringify(backupPayload).length,
      payload: backupPayload // Client will upload this
  });
}
