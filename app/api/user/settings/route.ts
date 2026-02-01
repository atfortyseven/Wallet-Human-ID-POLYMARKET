import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from 'crypto';
import { validateUserSettings, validatePartialSettings, getDefaultUserSettings } from "@/lib/settings-validation";

// ============================================================================
// GET /api/user/settings - Load user settings
// ============================================================================

export async function GET(request: NextRequest) {
  try {
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

    // Return settings with sync metadata
    const settings = authUser.userSettings || null;
    
    return NextResponse.json({
      success: true,
      settings: settings ? {
        ...settings,
        contacts: typeof settings.contacts === 'string' 
          ? JSON.parse(settings.contacts as string) 
          : settings.contacts,
        notificationsConfig: typeof settings.notificationsConfig === 'string'
          ? JSON.parse(settings.notificationsConfig as string)
          : settings.notificationsConfig,
      } : getDefaultUserSettings(),
      meta: settings ? {
        version: settings.version,
        lastSyncAt: settings.lastSyncAt,
        syncHash: settings.syncHash,
      } : null,
    });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/user/settings - Full settings update with validation & audit
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate incoming data
    const validation = validatePartialSettings(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.errors?.errors 
        },
        { status: 400 }
      );
    }

    // Find AuthUser
    const authUser = await prisma.authUser.findUnique({
      where: { email: session.user.email },
      include: { userSettings: true },
    });

    if (!authUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate new hash
    const normalizedData = JSON.stringify(data, Object.keys(data).sort());
    const newHash = createHash('md5').update(normalizedData).digest('hex');

    // Get client IP and User-Agent for audit
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Prepare update data
    const updateData: any = {
      ...data,
      syncHash: newHash,
      lastSyncAt: new Date(),
      updatedAt: new Date(),
    };

    // Handle JSON fields
    if (data.contacts) {
      updateData.contacts = JSON.stringify(data.contacts);
    }
    if (data.notifications) {
      updateData.notificationsConfig = JSON.stringify(data.notifications);
    }

    // Upsert settings with version increment
    const settings = await prisma.userSettings.upsert({
      where: { authUserId: authUser.id },
      update: {
        ...updateData,
        version: { increment: 1 },
      },
      create: {
        authUserId: authUser.id,
        ...updateData,
        version: 1,
      },
    });

    // Create audit trail entry
    await prisma.userSettingsHistory.create({
      data: {
        settingsId: settings.id,
        authUserId: authUser.id,
        changeType: authUser.userSettings ? 'UPDATE' : 'CREATE',
        previousValue: authUser.userSettings ? 
          JSON.stringify(authUser.userSettings) : null,
        newValue: JSON.stringify(data),
        fullSnapshot: JSON.stringify(settings),
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ 
      success: true, 
      settings: {
        ...settings,
        contacts: typeof settings.contacts === 'string'
          ? JSON.parse(settings.contacts as string)
          : settings.contacts,
        notificationsConfig: typeof settings.notificationsConfig === 'string'
          ? JSON.parse(settings.notificationsConfig as string)
          : settings.notificationsConfig,
      },
      meta: {
        version: settings.version,
        lastSyncAt: settings.lastSyncAt,
        syncHash: settings.syncHash,
      }
    });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/user/settings - Partial update (single or multiple fields)
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate partial update
    const validation = validatePartialSettings(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.errors?.errors 
        },
        { status: 400 }
      );
    }

    // Find AuthUser with current settings
    const authUser = await prisma.authUser.findUnique({
      where: { email: session.user.email },
      include: { userSettings: true },
    });

    if (!authUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!authUser.userSettings) {
      return NextResponse.json(
        { error: "Settings not initialized. Use PUT first." },
        { status: 400 }
      );
    }

    // Merge with existing settings
    const currentSettings = authUser.userSettings;
    const mergedSettings = {
      ...currentSettings,
      ...data,
    };

    // Calculate new hash
    const normalizedData = JSON.stringify(mergedSettings, Object.keys(mergedSettings).sort());
    const newHash = createHash('md5').update(normalizedData).digest('hex');

    // Get client IP and User-Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Prepare update data
    const updateData: any = {
      ...data,
      syncHash: newHash,
      lastSyncAt: new Date(),
      updatedAt: new Date(),
      version: { increment: 1 },
    };

    // Handle JSON fields
    if (data.contacts) {
      updateData.contacts = JSON.stringify(data.contacts);
    }
    if (data.notifications) {
      updateData.notificationsConfig = JSON.stringify(data.notifications);
    }

    // Update settings
    const settings = await prisma.userSettings.update({
      where: { authUserId: authUser.id },
      data: updateData,
    });

    // Create audit trail for each changed field
    const changedFields = Object.keys(data);
    for (const field of changedFields) {
      await prisma.userSettingsHistory.create({
        data: {
          settingsId: settings.id,
          authUserId: authUser.id,
          field,
          changeType: 'UPDATE',
          previousValue: (currentSettings as any)[field] ? 
            JSON.stringify((currentSettings as any)[field]) : null,
          newValue: JSON.stringify(data[field]),
          fullSnapshot: JSON.stringify(settings),
          ipAddress,
          userAgent,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        contacts: typeof settings.contacts === 'string'
          ? JSON.parse(settings.contacts as string)
          : settings.contacts,
        notificationsConfig: typeof settings.notificationsConfig === 'string'
          ? JSON.parse(settings.notificationsConfig as string)
          : settings.notificationsConfig,
      },
      meta: {
        version: settings.version,
        lastSyncAt: settings.lastSyncAt,
        syncHash: settings.syncHash,
        updatedFields: changedFields,
      }
    });
  } catch (error: any) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
