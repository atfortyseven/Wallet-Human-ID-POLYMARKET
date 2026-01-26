/**
 * Weekly Merkle Tree Generator Script
 * 
 * Generates Merkle trees for royalty distribution
 * Run via cron job: 0 0 * * 0 (Every Sunday at midnight)
 * 
 * Usage: npx tsx scripts/generate-merkle-tree.ts
 */

import { PrismaClient } from '@prisma/client';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

interface CreatorRoyalty {
    address: string;
    amount: number;
}

async function generateWeeklyMerkleTree() {
    console.log('🌳 Starting Merkle tree generation...');

    try {
        // Calculate period (last 7 days)
        const periodEnd = new Date();
        const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

        console.log(`📅 Period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);

        // Get all unclaimed royalties from this period
        const royalties = await prisma.royaltyAccrual.findMany({
            where: {
                timestamp: {
                    gte: periodStart,
                    lte: periodEnd,
                },
                claimed: false,
                merkleTreeId: null,
            },
            include: {
                proposal: true,
            },
        });

        if (royalties.length === 0) {
            console.log('ℹ️  No unclaimed royalties for this period');
            return;
        }

        console.log(`💰 Found ${royalties.length} royalty accruals`);

        // Aggregate by creator address
        const creatorTotals: Record<string, number> = {};

        for (const royalty of royalties) {
            const creator = royalty.proposal.creatorAddress;
            const amount = parseFloat(royalty.amount.toString());

            if (!creatorTotals[creator]) {
                creatorTotals[creator] = 0;
            }
            creatorTotals[creator] += amount;
        }

        const creators = Object.keys(creatorTotals);
        console.log(`👥 ${creators.length} unique creators`);

        // Generate Merkle tree leaves
        const leaves = creators.map((address) => {
            const amount = creatorTotals[address];
            // Convert to USDC decimals (6 decimals)
            const amountWei = ethers.utils.parseUnits(amount.toFixed(6), 6);

            return keccak256(
                ethers.utils.solidityPack(['address', 'uint256'], [address, amountWei.toString()])
            );
        });

        // Build Merkle tree
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = tree.getHexRoot();

        console.log(`🌲 Merkle root: ${root}`);

        // Calculate total amount
        const totalAmount = Object.values(creatorTotals).reduce((sum, amt) => sum + amt, 0);

        console.log(`💵 Total distribution: $${totalAmount.toFixed(2)}`);

        // Store in database
        const distribution = await prisma.merkleDistribution.create({
            data: {
                merkleRoot: root,
                totalAmount,
                periodStart,
                periodEnd,
                treeData: {
                    leaves: creatorTotals,
                    root,
                },
                ipfsHash: 'QmPending...', // TODO: Upload to IPFS
                status: 'PUBLISHED',
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            },
        });

        console.log(`✅ Distribution created: ${distribution.id}`);

        // Link royalties to this distribution
        await prisma.royaltyAccrual.updateMany({
            where: {
                id: {
                    in: royalties.map((r) => r.id),
                },
            },
            data: {
                merkleTreeId: distribution.id,
            },
        });

        console.log(`🔗 Linked ${royalties.length} royalties to distribution`);

        // TODO: Publish Merkle root to smart contract
        // This would call the MarketGovernance.publishMerkleRoot() function
        console.log('⚠️  Smart contract integration pending');

        // Print summary
        console.log('\n📊 Distribution Summary:');
        console.log('━'.repeat(50));
        creators.forEach((address) => {
            console.log(`${address}: $${creatorTotals[address].toFixed(2)}`);
        });
        console.log('━'.repeat(50));
        console.log(`Total: $${totalAmount.toFixed(2)}`);

        console.log('\n✨ Merkle tree generation complete!');

    } catch (error) {
        console.error('❌ Error generating Merkle tree:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    generateWeeklyMerkleTree()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export { generateWeeklyMerkleTree };
