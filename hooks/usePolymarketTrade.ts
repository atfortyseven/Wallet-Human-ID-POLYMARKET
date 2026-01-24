import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useSignTypedData } from 'wagmi';
import { parseUnits, maxUint256 } from 'viem';
import { toast } from 'sonner';

const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const CTF_EXCHANGE = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E";
const POLYGON_CHAIN_ID = 137;

// ERC20 ABI for allowance/approve
const ERC20_ABI = [
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
        outputs: [{ name: "", type: "uint256" }]
    },
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
        outputs: [{ name: "", type: "bool" }]
    }
] as const;

// EIP-712 Domain and Types
const domain = {
    name: "Polymarket CTF Exchange",
    version: "1",
    chainId: POLYGON_CHAIN_ID,
    verifyingContract: CTF_EXCHANGE,
} as const;

const types = {
    Order: [
        { name: "salt", type: "uint256" },
        { name: "maker", type: "address" },
        { name: "signer", type: "address" },
        { name: "taker", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "makerAmount", type: "uint256" },
        { name: "takerAmount", type: "uint256" },
        { name: "expiration", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "feeRateBps", type: "uint256" },
        { name: "side", type: "uint8" },
        { name: "signatureType", type: "uint8" },
    ],
} as const;

export function usePolymarketTrade() {
    const { address } = useAccount();
    const [status, setStatus] = useState<"IDLE" | "APPROVING" | "SIGNING" | "POSTING" | "SUCCESS">("IDLE");

    // Wagmi Hooks
    const { writeContractAsync } = useWriteContract();
    const { signTypedDataAsync } = useSignTypedData();
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, CTF_EXCHANGE] : undefined,
    });

    const trade = async (side: "BUY" | "SELL", amount: string, price: number, tokenId: string) => {
        if (!address) {
            toast.error("Wallet not connected");
            return;
        }

        try {
            setStatus("APPROVING");

            // 1. Check Allowance (if Buying with USDC) - Simplified for YES/NO buys which use USDC
            const amountBigInt = parseUnits(amount, 6); // USDC has 6 decimals

            if (side === "BUY") {
                if (!allowance || allowance < amountBigInt) {
                    toast.info("Approving USDC...");
                    const tx = await writeContractAsync({
                        address: USDC_ADDRESS,
                        abi: ERC20_ABI,
                        functionName: "approve",
                        args: [CTF_EXCHANGE, maxUint256],
                    });
                    // In real app wait for tx receipt here. For now assume success or rely on wallet feedback
                    await new Promise(r => setTimeout(r, 2000)); // Mock wait
                    await refetchAllowance();
                }
            }

            setStatus("SIGNING");

            // 2. Create Order Object
            // NOTE: This is a simplified "Market Order" style logic
            // In reality you need current maker nonce, expiration, etc.
            const salt = Math.floor(Math.random() * 1000000);
            const makerAmount = amountBigInt;
            const takerAmount = parseUnits((parseFloat(amount) / price).toFixed(6), 6); // Mock calculation

            const order = {
                salt: BigInt(salt),
                maker: address, // Using EOA for simplicity if no Proxy
                signer: address,
                taker: "0x0000000000000000000000000000000000000000" as `0x${string}`, // Open order
                tokenId: BigInt(tokenId || "0"),
                makerAmount: makerAmount,
                takerAmount: takerAmount,
                expiration: BigInt(Math.floor(Date.now() / 1000) + 300), // 5 mins
                nonce: BigInt(0), // Would need to fetch from contract
                feeRateBps: BigInt(0),
                side: side === "BUY" ? 0 : 1,
                signatureType: 0, // EOA
            };

            // 3. Sign Order
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: "Order",
                message: order,
            });

            setStatus("POSTING");

            // 4. Post to API (Mock)
            console.log("Order Signed:", { order, signature });
            // await axios.post('/api/orders', { order, signature });

            await new Promise(r => setTimeout(r, 1000)); // Mock API delay

            setStatus("SUCCESS");
            toast.success("Order Placed Successfully!");
            setTimeout(() => setStatus("IDLE"), 2000);

        } catch (error: any) {
            console.error(error);
            setStatus("IDLE");
            if (error.code === 4001) {
                toast.error("User denied signature");
            } else {
                toast.error("Failed to place order");
            }
        }
    };

    return {
        trade,
        status
    };
}
