/**
 * API Route: Cast Vote
 * POST /api/governance/vote
 * 
 * Handles vote submission with World ID verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyCloudProof, IVerifyResponse } from '@worldcoin/idkit';

const prisma = new PrismaClient();

interface VoteRequest {
    proposalId: string;
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
    voterAddress: string;
    worldIdProof: {
        merkle_root: string;
        nullifier_hash: string;
        proof: string;
        verification_level: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: VoteRequest = await request.json();

        // Validate input
        if (!body.proposalId || !body.vote || !body.voterAddress || !body.worldIdProof) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify World ID proof
        const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
        const action = `vote_${body.proposalId}`;

        const verifyRes = (await verifyCloudProof(
            body.worldIdProof.proof,
            app_id,
            action,
            body.worldIdProof.nullifier_hash
        )) as IVerifyResponse;

        if (!verifyRes.success) {
            return NextResponse.json(
                { error: 'World ID verification failed' },
                { status: 401 }
            );
        }

        // Check if proposal exists and is still in voting period
        const proposal = await prisma.marketProposal.findUnique({
            where: { id: body.proposalId },
        });

        if (!proposal) {
            return NextResponse.json(
                { error: 'Proposal not found' },
                { status: 404 }
            );
        }

        if (proposal.status !== 'VOTING') {
            return NextResponse.json(
                { error: 'Voting period has ended' },
                { status: 400 }
            );
        }

        if (new Date() > proposal.votingEndsAt) {
            return NextResponse.json(
                { error: 'Voting deadline has passed' },
                { status: 400 }
            );
        }

        // Check if user already voted (using nullifier hash)
        const existingVote = await prisma.proposalVote.findUnique({
            where: {
                proposalId_nullifierHash: {
                    proposalId: body.proposalId,
                    nullifierHash: body.worldIdProof.nullifier_hash,
                },
            },
        });

        if (existingVote) {
            return NextResponse.json(
                { error: 'You have already voted on this proposal' },
                { status: 409 }
            );
        }

        // Record vote
        const vote = await prisma.proposalVote.create({
            data: {
                proposalId: body.proposalId,
                nullifierHash: body.worldIdProof.nullifier_hash,
                voterAddress: body.voterAddress,
                vote: body.vote,
                merkleRoot: body.worldIdProof.merkle_root,
                proof: body.worldIdProof.proof,
                verificationLevel: body.worldIdProof.verification_level,
            },
        });

        // Update proposal vote counts
        const updateData: any = {};
        if (body.vote === 'FOR') {
            updateData.votesFor = { increment: 1 };
        } else if (body.vote === 'AGAINST') {
            updateData.votesAgainst = { increment: 1 };
        }

        const updatedProposal = await prisma.marketProposal.update({
            where: { id: body.proposalId },
            data: updateData,
        });

        // Check if proposal should be approved
        if (updatedProposal.votesFor >= updatedProposal.votingThreshold) {
            await prisma.marketProposal.update({
                where: { id: body.proposalId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                },
            });
        }

        // Create or update user
        await prisma.user.upsert({
            where: { walletAddress: body.voterAddress },
            update: {
                updatedAt: new Date(),
            },
            create: {
                walletAddress: body.voterAddress,
                worldIdNullifierHash: body.worldIdProof.nullifier_hash,
            },
        });

        // Update user metrics
        await prisma.userMetrics.upsert({
            where: { userAddress: body.voterAddress },
            update: {
                votescast: { increment: 1 },
                lastActiveAt: new Date(),
            },
            create: {
                userAddress: body.voterAddress,
                votescast: 1,
            },
        });

        return NextResponse.json({
            success: true,
            vote: {
                id: vote.id,
                vote: vote.vote,
                votedAt: vote.votedAt,
            },
            proposal: {
                votesFor: updatedProposal.votesFor,
                votesAgainst: updatedProposal.votesAgainst,
                status: updatedProposal.status,
            },
        });

    } catch (error) {
        console.error('Error recording vote:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
