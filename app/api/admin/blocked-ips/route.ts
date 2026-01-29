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

// GET: List blocked IPs
export async function GET(request: NextRequest) {
    const isAuthenticated = await isAdminAuthenticated(request);
    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const blockedIPs = await prisma.blockedIP.findMany({
            orderBy: { blockedAt: 'desc' },
        });

        // Filter out expired blocks
        const activeBlocks = blockedIPs.filter(block => {
            if (!block.expiresAt) return true; // Permanent block
            return block.expiresAt > new Date(); // Not expired
        });

        return NextResponse.json({
            blockedIPs: activeBlocks,
            totalCount: activeBlocks.length,
        });
    } catch (error) {
        console.error('Failed to fetch blocked IPs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blocked IPs' },
            { status: 500 }
        );
    }
}

// POST: Manually block an IP
export async function POST(request: NextRequest) {
    const isAuthenticated = await isAdminAuthenticated(request);
    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ipAddress, reason, expiresAt } = body;

        if (!ipAddress || !reason) {
            return NextResponse.json(
                { error: 'Missing required fields: ipAddress, reason' },
                { status: 400 }
            );
        }

        const blockedIP = await prisma.blockedIP.create({
            data: {
                ipAddress,
                reason,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return NextResponse.json({
            success: true,
            blockedIP,
        });
    } catch (error) {
        console.error('Failed to block IP:', error);
        return NextResponse.json(
            { error: 'Failed to block IP' },
            { status: 500 }
        );
    }
}

// DELETE: Unblock an IP
export async function DELETE(request: NextRequest) {
    const isAuthenticated = await isAdminAuthenticated(request);
    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const ipAddress = searchParams.get('ip');

        if (!ipAddress) {
            return NextResponse.json(
                { error: 'Missing IP address parameter' },
                { status: 400 }
            );
        }

        await prisma.blockedIP.delete({
            where: { ipAddress },
        });

        return NextResponse.json({
            success: true,
            message: `IP ${ipAddress} has been unblocked`,
        });
    } catch (error) {
        console.error('Failed to unblock IP:', error);
        return NextResponse.json(
            { error: 'Failed to unblock IP' },
            { status: 500 }
        );
    }
}
