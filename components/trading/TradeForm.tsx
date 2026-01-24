"use client";

import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { parseEther } from "viem";
import { domain, types, Order } from "@/lib/eip712";
import { postOrder } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { usePolymarketSession } from "@/hooks/usePolymarketSession";

interface TradeFormProps {
    marketSlug: string;
    tokenIdYes: string;
    tokenIdNo: string;
}

export default function TradeForm({ marketSlug, tokenIdYes, tokenIdNo }: TradeFormProps) {
    const { address } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const { isAuthenticated } = usePolymarketSession();

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleTrade = async (side: "YES" | "NO") => {
        if (!address || !isAuthenticated) {
            setMsg("Please login and connect wallet first.");
            return;
        }
        setLoading(true);
        setMsg("");

        try {
            const tokenId = side === "YES" ? BigInt(tokenIdYes) : BigInt(tokenIdNo);
            const rawAmount = parseEther(amount || "0"); // USDC Usually 6 decimals, but parseEther is 18. Adjust for real USDC (6).

            // Construct Order Object matchng EIP-712 types
            // MOCK VALUES for demo. In real app, nonce comes from API, expiration from user settings.
            const order: Order = {
                salt: BigInt(Date.now()),
                maker: address,
                signer: address,
                taker: "0x0000000000000000000000000000000000000000", // Open order
                tokenId: tokenId,
                makerAmount: rawAmount,
                takerAmount: rawAmount, // Simplified 1:1 price for demo
                expiration: BigInt(Math.floor(Date.now() / 1000) + 300), // 5 mins
                nonce: BigInt(0),
                feeRateBps: BigInt(0),
                side: side === "YES" ? 0 : 1, // Buy/Sell logic depends on CTF. Assume 0=Buy for this demo context.
                signatureType: 0 // EOA
            };

            // 1. Sign EIP-712
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: "Order",
                message: order,
            });

            // 2. Post to API
            await postOrder(order, signature);
            setMsg("Order Placed Successfully!");
            setAmount("");

        } catch (e: any) {
            console.error(e);
            setMsg("Error: " + (e.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-4">Trade {marketSlug}</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Amount (USDC)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        disabled={loading}
                        onClick={() => handleTrade("YES")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "BUY YES"}
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => handleTrade("NO")}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "BUY NO"}
                    </button>
                </div>

                {msg && (
                    <p className={`text-center text-sm font-medium ${msg.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                        {msg}
                    </p>
                )}
            </div>
        </div>
    );
}
