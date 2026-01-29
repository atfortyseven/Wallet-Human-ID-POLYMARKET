import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-prod';

// Simple admin authentication check
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
        return false;
    }

    try {
        await jwtVerify(adminToken.value, new TextEncoder().encode(JWT_SECRET));
        return true;
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated(request);
    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    try {
        // Build where clause
        const where: any = {};
        if (type) where.type = type;
        if (severity) where.severity = severity;

        // Get events with pagination
        const events = await prisma.securityEvent.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: limit,
            skip: offset,
        });

        // Get total count
        const totalCount = await prisma.securityEvent.count({ where });

        // Get statistics
        const stats = await prisma.securityEvent.groupBy({
            by: ['type'],
            _count: true,
        });

        const severityStats = await prisma.securityEvent.groupBy({
            by: ['severity'],
            _count: true,
        });

        return NextResponse.json({
            events,
            totalCount,
            limit,
            offset,
            statistics: {
                byType: stats.map(s => ({ type: s.type, count: s._count })),
                bySeverity: severityStats.map(s => ({ severity: s.severity, count: s._count })),
            },
        });
    } catch (error) {
        console.error('Failed to fetch security events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch security events' },
            { status: 500 }
        );
    }
}
