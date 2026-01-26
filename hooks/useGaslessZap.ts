"use client";

import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { toast } from "sonner";
import { parseEther, formatEther } from "viem";

/**
 * Hook for gasless Zap functionality
 * 
 * Users sign a zap intent off-chain, relayer executes on-chain
 * User pays NO gas fees
 */

const ZAP_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZAP_GASLESS_CONTRACT_ADDRESS as `0x${string}`;

// EIP-712 Domain
const domain = {
    name: "ZapContractGasless",
    version: "1",
    chainId: 84532, // Base Sepolia
    verifyingContract: ZAP_CONTRACT_ADDRESS,
} as const;

// EIP-712 Types
const types = {
    Zap: [
        { name: "user", type: "address" },
        { name: "wldAmount", type: "uint256" },
        { name: "minUSDC", type: "uint256" },
        { name: "conditionId", type: "bytes32" },
        { name: "outcomeIndex", type: "uint256" },
        { name: "minSharesOut", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
    ],
} as const;

interface ZapParams {
    wldAmount: string; // In WLD (e.g. "10")
    conditionId: string; // Polymarket condition ID
    outcomeIndex: 0 | 1; // Binary outcome
    minUSDC?: string; // Optional slippage protection
    minSharesOut?: string; // Optional slippage protection
}

export function useGaslessZap() {
    const { address } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    /**
     * Execute a gasless zap
     * User signs, relayer executes
     */
    const executeGaslessZap = async (params: ZapParams) => {
        if (!address) {
            toast.error("Please connect your wallet");
            return;
        }

        if (!ZAP_CONTRACT_ADDRESS) {
            toast.error("Zap contract not configured");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Preparing gasless zap...");

        try {
            // Step 1: Fetch current nonce from contract
            const nonceRes = await fetch(`/api/zap/nonce?address=${address}`);
            const { nonce } = await nonceRes.json();

            // Step 2: Calculate deadline (5 minutes from now)
            const deadline = Math.floor(Date.now() / 1000) + 300;

            // Step 3: Parse amounts
            const wldAmount = parseEther(params.wldAmount);
            const minUSDC = params.minUSDC ? parseEther(params.minUSDC) : 0n;
            const minSharesOut = params.minSharesOut ? parseEther(params.minSharesOut) : 0n;

            // Step 4: Prepare message for signing
            const message = {
                user: address,
                wldAmount,
                minUSDC,
                conditionId: params.conditionId as `0x${string}`,
                outcomeIndex: BigInt(params.outcomeIndex),
                minSharesOut,
                nonce: BigInt(nonce),
                deadline: BigInt(deadline),
            };

            toast.loading("Please sign the transaction...", { id: toastId });

            // Step 5: Sign typed data (EIP-712)
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: "Zap",
                message,
            });

            toast.loading("Submitting to relayer...", { id: toastId });

            // Step 6: Send signature to relayer
            const response = await fetch("/api/relayer/zap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: address,
                    wldAmount: wldAmount.toString(),
                    minUSDC: minUSDC.toString(),
                    conditionId: params.conditionId,
                    outcomeIndex: params.outcomeIndex,
                    minSharesOut: minSharesOut.toString(),
                    nonce,
                    deadline,
                    signature,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Relayer execution failed");
            }

            // Step 7: Success!
            setTxHash(data.txHash);
            toast.success("Zap executed successfully! (Gasless)", { id: toastId });

            return {
                success: true,
                txHash: data.txHash,
                sharesReceived: data.sharesReceived,
            };

        } catch (error: any) {
            console.error("Gasless Zap Error:", error);
            toast.error(error.message || "Zap failed", { id: toastId });
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Estimate zap output (for UI preview)
     */
    const estimateZap = async (wldAmount: string) => {
        try {
            const res = await fetch(`/api/zap/estimate?wldAmount=${wldAmount}`);
            const data = await res.json();
            return {
                estimatedUSDC: data.estimatedUSDC,
                estimatedShares: data.estimatedShares,
                protocolFee: data.protocolFee,
            };
        } catch (error) {
            console.error("Estimate error:", error);
            return null;
        }
    };

    return {
        executeGaslessZap,
        estimateZap,
        isLoading,
        txHash,
    };
}
