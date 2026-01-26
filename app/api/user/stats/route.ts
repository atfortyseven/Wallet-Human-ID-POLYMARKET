import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        // 1. Voting Power (For now, based on User Metrics Proposal Count + Base, or just mock logic if balance is client-side)
        // In this implementation, we'll fetch UserMetrics for reputation which could be a proxy for VP
        const metrics = await prisma.userMetrics.findUnique({
            where: { userAddress: address },
        });

        const votingPower = metrics ? metrics.reputationScore + 100 : 100; // Base 100 VP for everyone

        // 2. Active Proposals count
        const activeProposals = await prisma.marketProposal.count({
            where: { status: 'VOTING' },
        });

        // 3. Unclaimed Royalties
        // In a real app with Merkle Distributions, you'd check a Merkle Tree or Claim contract state.
        // For now, we will query the DB for any 'PENDING' claim records if they exist, or use UserMetrics.totalRoyalties - claimed
        // Assuming metrics tracks it:
        const unclaimedRoyalties = metrics
            ? Number(metrics.totalRoyaltiesEarned) - Number(metrics.totalRoyaltiesClaimed)
            : 0;

        return NextResponse.json({
            votingPower,
            activeProposals,
            unclaimedRoyalties: Math.max(0, unclaimedRoyalties) // Ensure no negative
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
