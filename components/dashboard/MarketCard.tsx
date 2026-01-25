"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { Market } from "@/lib/polymarket";
import { useState } from "react";
import { usePolymarketBet } from "@/hooks/usePolymarketBet";

interface MarketCardProps {
    market?: Market;
    isLoading?: boolean;
}

export default function MarketCard({ market, isLoading }: MarketCardProps) {
    const { placeBet, status } = usePolymarketBet();
    const [betAmount, setBetAmount] = useState("10"); // Default 10 USDC

    const handleBet = (outcome: "YES" | "NO") => {
        if (!market) return;
        placeBet(outcome, betAmount, market.id);
    };

    if (isLoading || !market) {
        return (
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 h-[300px] animate-pulse">
                <div className="h-40 bg-white/10 rounded-xl mb-4" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
        );
    }

    // Parse Prices (Assume Binary Yes/No for simplicity in MVP)
    const yesPrice = market.outcomePrices[0] ? Math.round(parseFloat(market.outcomePrices[0]) * 100) : 50;
    const noPrice = 100 - yesPrice;
    const volumeFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseFloat(market.volume));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl shadow-lg transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        >
            {/* Image Header */}
            <div className="relative h-40 w-full overflow-hidden">
                {market.image ? (
                    <Image
                        src={market.image}
                        alt={market.question}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent opacity-80" />

                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-serif text-lg font-bold text-white leading-tight line-clamp-2 text-shadow-sm">
                        {market.question}
                    </h3>
                </div>
            </div>

            {/* Stats Body */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-4">
                {/* Volume & Tag */}
                <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Vol: {volumeFormatted}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3 h-3" />
                        <span>Generic</span>
                    </div>
                </div>

                {/* Bet Actions */}
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="w-16 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-white/30"
                    />
                    <span className="text-xs text-white/40 font-mono">USDC</span>
                </div>

                {/* Outcome Bars */}
                <div className="grid grid-cols-2 gap-3">
                    {/* YES */}
                    <button
                        onClick={() => handleBet("YES")}
                        disabled={status !== "IDLE"}
                        className="relative flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 group/btn hover:bg-emerald-500/20 transition-all text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">
                                {status === "TRADING" || status === "APPROVING" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Bet Yes"}
                            </span>
                            <span className="text-lg font-bold text-white">{yesPrice}%</span>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 top-0 bg-emerald-500/10 transition-all group-hover/btn:bg-emerald-500/20"
                            style={{ width: `${yesPrice}%` }}
                        />
                    </button>

                    {/* NO */}
                    <button
                        onClick={() => handleBet("NO")}
                        disabled={status !== "IDLE"}
                        className="relative flex-1 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 group/btn hover:bg-rose-500/20 transition-all text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">
                                {status === "TRADING" || status === "APPROVING" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Bet No"}
                            </span>
                            <span className="text-lg font-bold text-white">{noPrice}%</span>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 top-0 bg-rose-500/10 transition-all group-hover/btn:bg-rose-500/20"
                            style={{ width: `${noPrice}%` }}
                        />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
