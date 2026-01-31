import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      telegramEnabled, 
      telegramChatId, 
      telegramTopicId,
      telegramUsername,
      emailNotifications,
      whaleThreshold 
    } = body;

    // Update or Create UserSettings
    const settings = await prisma.userSettings.upsert({
      where: { authUserId },
      update: {
        telegramEnabled,
        telegramChatId,
        telegramTopicId,
        telegramUsername,
        whaleThreshold,
        emailNotifications,
      },
      create: {
        authUserId,
        telegramEnabled: telegramEnabled || false,
        telegramChatId,
        telegramTopicId,
        telegramUsername,
        whaleThreshold: whaleThreshold || 50000,
        emailNotifications: emailNotifications ?? true,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { authUserId },
    });

    return NextResponse.json({ settings: settings || {} });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
