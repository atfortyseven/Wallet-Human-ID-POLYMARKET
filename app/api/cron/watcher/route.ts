import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";

const prisma = new PrismaClient();
const RPC_URL = process.env.BASE_MAINNET_RPC_URL || process.env.BASE_SEPOLIA_RPC_URL;

export async function GET(request: NextRequest) {
    if (!RPC_URL) return NextResponse.json({ error: "Missing RPC config" }, { status: 500 });

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // 1. Fetch SUBMITTED transactions
        const pendingVotes = await prisma.proposalVote.findMany({
            where: { txStatus: 'SUBMITTED', txHash: { not: null } },
            take: 20 // Batch processing
        });

        const results = [];

        for (const vote of pendingVotes) {
            if (!vote.txHash) continue;

            const receipt = await provider.getTransactionReceipt(vote.txHash);

            if (receipt) {
                if (receipt.status === 1) {
                    // SUCCESS
                    await prisma.proposalVote.update({
                        where: { id: vote.id },
                        data: { txStatus: 'CONFIRMED' }
                    });

                    // Increment counts logic (safe to do here if not done optimistically)
                    // Simplified: We assume counts managed elsewhere or here

                    results.push({ id: vote.id, status: 'CONFIRMED' });
                } else {
                    // REVERTED
                    await prisma.proposalVote.update({
                        where: { id: vote.id },
                        data: { txStatus: 'FAILED', errorMessage: 'Tx Reverted on-chain' }
                    });
                    results.push({ id: vote.id, status: 'FAILED' });
                }
            } else {
                // Still Pending in mempool, do nothing
            }
        }

        return NextResponse.json({ processed: results.length, results });

    } catch (error) {
        console.error("Watcher Error:", error);
        return NextResponse.json({ error: "Watcher failed" }, { status: 500 });
    }
}
