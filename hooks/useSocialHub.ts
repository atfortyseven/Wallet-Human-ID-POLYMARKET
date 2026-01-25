"use client";

import { useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseUnits, erc20Abi } from 'viem';
import { toast } from "sonner";

// TODO: Replace with deployed SocialHub address
const HUB_ADDRESS = '0x0000000000000000000000000000000000000000';
// TODO: Replace with USDC address on Polygon
const USDC_POLYGON = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC.e (Bridged) // or native 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359

const HUB_ABI = [
    {
        inputs: [
            { internalType: "address", name: "_trader", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "sendTip",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    // Add other function signatures if needed (executeProxyTrade)
] as const;

export function useSocialHub() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const ensureApproval = async (amount: bigint) => {
        if (!address || !publicClient) return;

        try {
            // Check current allowance
            const allowance = await publicClient.readContract({
                address: USDC_POLYGON,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [address, HUB_ADDRESS],
            });

            if (allowance < amount) {
                toast.info("Approving USDC...");
                const tx = await writeContractAsync({
                    address: USDC_POLYGON,
                    abi: erc20Abi,
                    functionName: 'approve',
                    args: [HUB_ADDRESS, amount],
                });

                toast.loading("Waiting for approval confirmation...");
                await publicClient.waitForTransactionReceipt({ hash: tx });
                toast.dismiss();
                toast.success("USDC Approved!");
            }
        } catch (error: any) {
            console.error("Approval failed:", error);
            throw new Error("Token approval failed");
        }
    };

    const sendTip = async (traderAddress: string, amountUsdc: string) => {
        if (!address) {
            toast.error("Connect wallet first");
            return;
        }

        try {
            const amount = parseUnits(amountUsdc, 6);

            // 1. Ensure Approval (Auto-handling)
            await ensureApproval(amount);

            // 2. Send Tip
            toast.loading("Sending tip...");
            const hash = await writeContractAsync({
                address: HUB_ADDRESS,
                abi: HUB_ABI,
                functionName: 'sendTip',
                args: [traderAddress as `0x${string}`, amount],
            });

            return hash;
        } catch (error: any) {
            console.error("Tip failed:", error);
            throw error;
        } finally {
            toast.dismiss();
        }
    };

    return { sendTip };
}
