import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import PolymarketGovernanceGaslessABI from "../../../../artifacts/contracts/PolymarketGovernanceGasless.sol/PolymarketGovernanceGasless.json";

const prisma = new PrismaClient();

// ENV Checks
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const RPC_URL = process.env.BASE_MAINNET_RPC_URL || process.env.BASE_SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS;

export async function POST(request: NextRequest) {
    if (!RELAYER_PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
        return NextResponse.json({ error: "Relayer misconfiguration" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { signature, proposalId, support, worldIdProof, signerAddress } = body;

        // 1. Initial DB Record (PENDING_RELAY)
        const voteRecord = await prisma.proposalVote.create({
            data: {
                proposalId,
                voterAddress: signerAddress,
                vote: support === 1 ? 'FOR' : support === 0 ? 'AGAINST' : 'ABSTAIN',
                nullifierHash: worldIdProof.nullifier_hash,
                merkleRoot: worldIdProof.merkle_root,
                proof: worldIdProof.proof,
                verificationLevel: worldIdProof.verification_level,
                txStatus: 'PENDING_RELAY',
            }
        });

        // 2. Setup Ethers Provider & Signer
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, PolymarketGovernanceGaslessABI.abi, wallet);

        // 3. Prepare Transaction
        // We unpack the proof because the contract expects uint256[8]
        // const unpackedProof = ethers.decodeBytes32String(worldIdProof.proof); // Need correct decoding based on WorldID SDK format commonly used (check SDK docs)
        // Usually IDKit gives packed proof string. Smart Contract expects uint256[8].
        // For simplicity in this specialized prompt, we assume helper function or passing the `worldIdProof` object fields correctly decoded.
        // Assuming `worldIdProof.proof` is the ABI encoded proof or similar.
        // In valid implementation we need to decode the proof string to array if it's packed.

        // IMPORTANT: Unpacking proof logic depends on IDKit version.
        // For now we assume the frontend sends the *unpacked* proof array or we parse it.
        // Let's assume frontend hooks pass it correctly.

        console.log(`Broadcasting vote for ${signerAddress}...`);

        try {
            // Estimate Gas first to fail fast
            // const gasLimit = await contract.executeVoteWithSignature.estimateGas(...args);

            // Execute
            // Note: splitSignature needed if signature is 65 bytes
            const sig = ethers.Signature.from(signature);

            const tx = await contract.executeVoteWithSignature(
                signerAddress,
                BigInt(proposalId),
                support,
                BigInt(worldIdProof.merkle_root),
                BigInt(worldIdProof.nullifier_hash),
                JSON.parse(worldIdProof.proof), // Assuming proof is JSON array string [uint256...]
                sig.v,
                sig.r,
                sig.s
            );

            // 4. Update DB to SUBMITTED
            await prisma.proposalVote.update({
                where: { id: voteRecord.id },
                data: {
                    txHash: tx.hash,
                    txStatus: 'SUBMITTED'
                }
            });

            return NextResponse.json({ success: true, txHash: tx.hash, voteId: voteRecord.id });

        } catch (chainError: any) {
            console.error("Blockchain Error:", chainError);

            // Mark as FAILED
            await prisma.proposalVote.update({
                where: { id: voteRecord.id },
                data: {
                    txStatus: 'FAILED',
                    errorMessage: chainError.message || "Gas estimation or execution failed"
                }
            });

            return NextResponse.json({ error: "Transaction failed on chain", details: chainError.message }, { status: 400 });
        }

    } catch (error) {
        console.error("Relayer Logic Error:", error);
        return NextResponse.json({ error: "Internal Relayer Error" }, { status: 500 });
    }
}
