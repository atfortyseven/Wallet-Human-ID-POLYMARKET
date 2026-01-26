import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { toast } from 'sonner';

// EIP-712 Domain
const domain = {
    name: 'Polymarket HumanDAO',
    version: '1',
    chainId: 10, // Optimism
    verifyingContract: '0x1234567890123456789012345678901234567890', // Replace with deployed contract
} as const;

// Types
const types = {
    Vote: [
        { name: 'proposalId', type: 'uint256' },
        { name: 'support', type: 'uint256' },
        { name: 'nullifierHash', type: 'uint256' },
    ],
} as const;

export function useGaslessVote() {
    const { address } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const [isSigning, setIsSigning] = useState(false);

    const vote = async (proposalId: string, support: number, worldIdProof: any) => {
        if (!address) throw new Error("Wallet not connected");

        setIsSigning(true);
        try {
            // 1. Sign Typed Data (EIP-712)
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: 'Vote',
                message: {
                    proposalId: BigInt(proposalId),
                    support: BigInt(support),
                    nullifierHash: BigInt(worldIdProof.nullifier_hash),
                },
            });

            // 2. Send to Relayer
            const response = await fetch('/api/relayer/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    signature,
                    proposalId,
                    support,
                    worldIdProof,
                    signerAddress: address
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Relayer failed");

            return data.txHash;

        } catch (error) {
            console.error("Gasless vote error:", error);
            throw error;
        } finally {
            setIsSigning(false);
        }
    };

    return { vote, isSigning };
}
