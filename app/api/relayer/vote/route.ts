import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { signature, proposalId, support, worldIdProof, signerAddress } = body;

        // 1. Here we would verify the World ID Proof again on backend or trust the one sent 
        // if we verified it in a previous step. For strict security, verify again.

        // 2. Here we would call the Smart Contract using a relayer wallet (EOA)
        // const tx = await relayerWallet.writeContract(...)

        // MOCK TRANSACTION for demo
        const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");

        // 3. Store Vote in DB
        await prisma.proposalVote.create({
            data: {
                proposalId,
                voterAddress: signerAddress,
                vote: support === 1 ? 'FOR' : support === 0 ? 'AGAINST' : 'ABSTAIN',
                nullifierHash: worldIdProof.nullifier_hash,
                merkleRoot: worldIdProof.merkle_root,
                proof: worldIdProof.proof,
                verificationLevel: worldIdProof.verification_level,
                txHash: mockTxHash,
                txStatus: 'CONFIRMED', // Enum value
            }
        });

        // Update Proposal Counts
        if (support === 1) {
            await prisma.marketProposal.update({
                where: { id: proposalId },
                data: { votesFor: { increment: 1 } }
            });
        } else if (support === 0) {
            await prisma.marketProposal.update({
                where: { id: proposalId },
                data: { votesAgainst: { increment: 1 } }
            });
        }

        return NextResponse.json({ success: true, txHash: mockTxHash });

    } catch (error) {
        console.error("Relayer Error:", error);
        return NextResponse.json({ error: "Relayer transaction failed" }, { status: 500 });
    }
}
