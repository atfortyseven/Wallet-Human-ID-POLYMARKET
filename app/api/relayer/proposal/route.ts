import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";

/**
 * Relayer API for Gasless Proposal Creation
 */

const GOVERNANCE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS!;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";

const GOVERNANCE_ABI = [
    "function createProposalWithSignature(address proposer, string marketId, string title, string description, uint256 stakeAmount, uint256 nonce, uint256 deadline, bytes signature) external returns (bytes32)",
    "function getNonce(address user) external view returns (uint256)",
    "event ProposalCreated(bytes32 indexed proposalId, address indexed proposer, string marketId, string title, uint256 stakeAmount)"
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { proposer, marketId, title, description, stakeAmount, nonce, deadline, signature } = body;

        if (!proposer || !marketId || !title || !signature) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        console.log(`[Relayer] Creating proposal for: ${proposer}`);

        // Setup provider & signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, GOVERNANCE_ABI, relayerWallet);

        // Check relayer balance
        const balance = await provider.getBalance(relayerWallet.address);
        if (balance < ethers.parseEther("0.001")) {
            return NextResponse.json({ error: "Relayer out of funds" }, { status: 503 });
        }

        // Execute transaction
        const tx = await governanceContract.createProposalWithSignature(
            proposer,
            marketId,
            title,
            description,
            stakeAmount,
            nonce,
            deadline,
            signature,
            { gasLimit: 500000 }
        );

        console.log(`[Relayer] Proposal tx sent: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait();

        // Parse ProposalCreated event
        let proposalId = null;
        for (const log of receipt.logs) {
            try {
                const parsed = governanceContract.interface.parseLog({
                    topics: log.topics as string[],
                    data: log.data,
                });
                if (parsed && parsed.name === "ProposalCreated") {
                    proposalId = parsed.args.proposalId;
                }
            } catch (e) { }
        }

        // Save to database
        if (proposalId) {
            await prisma.marketProposal.create({
                data: {
                    proposalId,
                    marketId,
                    question: title, // Mapping title to question
                    description: description || "",
                    outcomes: ["Yes", "No"],
                    resolutionCriteria: "Standard resolution",
                    category: "General",
                    creatorAddress: proposer.toLowerCase(),
                    creatorNullifier: `pending_${tx.hash}`, // Temporary unique placeholder
                    votesFor: 0,
                    votesAgainst: 0,
                    status: "CREATED", // Valid status
                    createdAt: new Date(),
                    votingEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week default
                    transactionHash: tx.hash,
                    txStatus: "SUBMITTED",
                    // Ignorar campos faltantes por ahora para el build
                } as any,
            });
        }

        return NextResponse.json({
            success: true,
            txHash: tx.hash,
            proposalId,
            blockNumber: receipt.blockNumber,
        });

    } catch (error: any) {
        console.error("[Relayer] Proposal creation error:", error);
        return NextResponse.json({ error: error.message || "Proposal creation failed" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get("address");

        if (!address) {
            return NextResponse.json({ error: "Address required" }, { status: 400 });
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, GOVERNANCE_ABI, provider);
        const nonce = await governanceContract.getNonce(address);

        return NextResponse.json({ nonce: nonce.toString() });

    } catch (error: any) {
        console.error("[Relayer] Nonce fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
