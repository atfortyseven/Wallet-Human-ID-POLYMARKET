"use client";

import { useState } from "react";
import { useGaslessZap } from "@/hooks/useGaslessZap";
import { useWLDBalance } from "@/hooks/useWLDBalance";
import { Loader2, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface GaslessZapInterfaceProps {
    marketId?: string;
    marketTitle?: string;
    conditionId: string;
}

export default function GaslessZapInterface({
    marketId,
    marketTitle,
    conditionId
}: GaslessZapInterfaceProps) {
    const { executeGaslessZap, estimateZap, isLoading, txHash } = useGaslessZap();
    const { balance: wldBalance } = useWLDBalance();

    const [wldAmount, setWldAmount] = useState("");
    const [outcomeIndex, setOutcomeIndex] = useState<0 | 1>(0);
    const [estimate, setEstimate] = useState<any>(null);

    // Handle amount change and fetch estimate
    const handleAmountChange = async (value: string) => {
        setWldAmount(value);

        if (parseFloat(value) > 0) {
            const est = await estimateZap(value);
            setEstimate(est);
        } else {
            setEstimate(null);
        }
    };

    // Execute the zap
    const handleZap = async () => {
        if (!wldAmount || parseFloat(wldAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (parseFloat(wldAmount) > parseFloat(wldBalance || "0")) {
            toast.error("Insufficient WLD balance");
            return;
        }

        await executeGaslessZap({
            wldAmount,
            conditionId,
            outcomeIndex,
            minUSDC: estimate?.estimatedUSDC ? (parseFloat(estimate.estimatedUSDC) * 0.98).toString() : undefined, // 2% slippage
            minSharesOut: estimate?.estimatedShares ? (parseFloat(estimate.estimatedShares) * 0.98).toString() : undefined,
        });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-surface/50 border border-glass-border rounded-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-midgard/10 rounded-lg">
                    <Zap className="w-5 h-5 text-midgard" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Gasless Zap</h3>
                    <p className="text-xs text-neutral-400">Convert WLD to outcome shares (Free)</p>
                </div>
            </div>

            {/* Market Info */}
            {marketTitle && (
                <div className="mb-4 p-3 bg-neutral-900/50 rounded-lg">
                    <p className="text-xs text-neutral-400 mb-1">Market</p>
                    <p className="text-sm font-medium">{marketTitle}</p>
                </div>
            )}

            {/* Amount Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Amount (WLD)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={wldAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-midgard transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleAmountChange(wldBalance || "0")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-midgard hover:text-midgard/80 transition-colors"
                    >
                        MAX
                    </button>
                </div>
                {wldBalance && (
                    <p className="text-xs text-neutral-400 mt-1">
                        Balance: {parseFloat(wldBalance).toFixed(2)} WLD
                    </p>
                )}
            </div>

            {/* Outcome Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Outcome
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setOutcomeIndex(0)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${outcomeIndex === 0
                                ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                                : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700"
                            }`}
                        disabled={isLoading}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setOutcomeIndex(1)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${outcomeIndex === 1
                                ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                                : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700"
                            }`}
                        disabled={isLoading}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Estimate Preview */}
            {estimate && (
                <div className="mb-4 p-4 bg-neutral-900/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Estimated USDC</span>
                        <span className="font-medium">${estimate.estimatedUSDC}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Estimated Shares</span>
                        <span className="font-medium">{estimate.estimatedShares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Protocol Fee (0.5%)</span>
                        <span className="font-medium">${estimate.protocolFee}</span>
                    </div>
                </div>
            )}

            {/* Zap Button */}
            <button
                onClick={handleZap}
                disabled={isLoading || !wldAmount || parseFloat(wldAmount) <= 0}
                className="w-full px-6 py-4 bg-midgard hover:bg-midgard/90 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : txHash ? (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Zap Complete!</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5" />
                        <span>Zap (Free - No Gas)</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            {/* Transaction Hash */}
            {txHash && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 mb-1">Transaction Hash</p>
                    <a
                        href={`https://sepolia.basescan.org/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-300 hover:underline break-all"
                    >
                        {txHash}
                    </a>
                </div>
            )}

            {/* Info Banner */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300">
                    ⚡ <strong>Gasless Transaction:</strong> You only sign, we pay the gas fees!
                </p>
            </div>
        </div>
    );
}
