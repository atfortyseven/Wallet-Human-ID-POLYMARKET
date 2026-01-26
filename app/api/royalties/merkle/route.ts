/**
 * API Route: Merkle Proof Generation & Claimable Rewards
 * POST /api/royalties/merkle - Generate Merkle proof for claim
 * GET /api/royalties/claimable - Get claimable rewards for address
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

// POST: Generate Merkle proof for claiming
export async function POST(request: NextRequest) {
    try {
        const { address, distributionId } = await request.json();

        if (!address || !distributionId) {
            return NextResponse.json(
                { error: 'Missing address or distributionId' },
                { status: 400 }
            );
        }

        // Get distribution
        const distribution = await prisma.merkleDistribution.findUnique({
            where: { id: distributionId },
        });

        if (!distribution) {
            return NextResponse.json(
                { error: 'Distribution not found' },
                { status: 404 }
            );
        }

        if (distribution.status !== 'PUBLISHED') {
            return NextResponse.json(
                { error: 'Distribution not published yet' },
                { status: 400 }
            );
        }

        // Check if already claimed
        const existingClaim = await prisma.rewardClaim.findUnique({
            where: {
                merkleTreeId_claimerAddress: {
                    merkleTreeId: distributionId,
                    claimerAddress: address,
                },
            },
        });

        if (existingClaim) {
            return NextResponse.json(
                { error: 'Reward already claimed' },
                { status: 409 }
            );
        }

        // Get tree data from distribution
        const treeData = distribution.treeData as any;
        const leaves = treeData.leaves as Record<string, number>;

        if (!leaves[address]) {
            return NextResponse.json(
                { error: 'No rewards available for this address' },
                { status: 404 }
            );
        }

        const amount = leaves[address];

        // Reconstruct Merkle tree
        const leafNodes = Object.entries(leaves).map(([addr, amt]) => {
            return keccak256(
                ethers.utils.solidityPack(['address', 'uint256'], [addr, amt])
            );
        });

        const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

        // Generate proof for this address
        const leaf = keccak256(
            ethers.utils.solidityPack(['address', 'uint256'], [address, amount])
        );
        const proof = tree.getHexProof(leaf);
        const leafIndex = leafNodes.findIndex(node => node.equals(leaf));

        return NextResponse.json({
            merkleRoot: distribution.merkleRoot,
            amount,
            merkleProof: proof,
            leafIndex,
        });

    } catch (error) {
        console.error('Error generating Merkle proof:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Fetch claimable rewards for address
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json(
                { error: 'Missing address parameter' },
                { status: 400 }
            );
        }

        // Get all published distributions
        const distributions = await prisma.merkleDistribution.findMany({
            where: {
                status: 'PUBLISHED',
                expiresAt: {
                    gte: new Date(), // Not expired
                },
            },
            orderBy: {
                periodEnd: 'desc',
            },
        });

        // Filter distributions where user has claimable rewards
        const claimableRewards = [];

        for (const distribution of distributions) {
            // Check if already claimed
            const existingClaim = await prisma.rewardClaim.findUnique({
                where: {
                    merkleTreeId_claimerAddress: {
                        merkleTreeId: distribution.id,
                        claimerAddress: address,
                    },
                },
            });

            if (existingClaim) {
                continue; // Already claimed
            }

            // Check if user has rewards in this distribution
            const treeData = distribution.treeData as any;
            const leaves = treeData.leaves as Record<string, number>;

            if (leaves[address]) {
                claimableRewards.push({
                    distributionId: distribution.id,
                    amount: leaves[address],
                    periodEnd: distribution.periodEnd,
                    expiresAt: distribution.expiresAt,
                });
            }
        }

        // Calculate total claimable
        const totalClaimable = claimableRewards.reduce(
            (sum, reward) => sum + reward.amount,
            0
        );

        return NextResponse.json({
            rewards: claimableRewards,
            totalClaimable,
            count: claimableRewards.length,
        });

    } catch (error) {
        console.error('Error fetching claimable rewards:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
