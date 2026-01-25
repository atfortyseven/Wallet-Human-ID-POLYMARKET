"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { polygon } from "wagmi/chains";
import { Toaster } from "sonner";
import NetworkSwitcher from "@/components/wallet/NetworkSwitcher";
import { usePolymarketData } from "@/hooks/usePolymarketData";
import PositionsDashboard from "./PositionsDashboard";
import { useState } from "react";
import SendModal from "@/components/wallet/SendModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";

export default function WalletDashboard() {
    const { address } = useAccount();
    const chainId = useChainId();
    const isPolygon = chainId === polygon.id;

    // Real Data Hook
    const { usdcBalance, positions, totalPortfolioValue, isLoading } = usePolymarketData();

    // Modals
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    return (
        <div className="w-full text-white font-sans p-4 md:p-8 min-h-[calc(100vh-200px)]">
            <Toaster position="bottom-right" theme="dark" richColors />
            <SendModal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />
            <ReceiveModal isOpen={isReceiveOpen} onClose={() => setIsReceiveOpen(false)} />

            {/* HEADER */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <NetworkSwitcher />
                    <div className="hidden md:flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isPolygon ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        <span className="text-sm font-medium tracking-wide text-white/90">
                            {isPolygon ? "Polymarket Live (Polygon)" : "Wrong Network - Switch to Polygon"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono text-white/70">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
                    </span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto space-y-8">

                {/* HERO: TOTAL VALUE & BALANCE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-8 rounded-[32px] bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <Activity className="w-32 h-32 text-indigo-500" />
                    </div>

                    <h2 className="text-sm uppercase tracking-[0.2em] text-white/50 font-bold mb-2">Total Portfolio Value</h2>
                    <div className="flex items-baseline space-x-2 relative z-10">
                        <span className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            ${totalPortfolioValue}
                        </span>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row md:items-end gap-6 relative z-10">
                        <div className="flex-1">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Available USDC (Polygon)</p>
                            <p className="text-xl font-medium text-emerald-400">${usdcBalance}</p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsSendOpen(true)}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2 font-bold transition-all hover:scale-105"
                            >
                                <ArrowUpRight className="w-4 h-4" /> Send
                            </button>
                            <button
                                onClick={() => setIsReceiveOpen(true)}
                                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                            >
                                <ArrowDownLeft className="w-4 h-4" /> Receive
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* POSITIONS DASHBOARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-lg font-bold text-white mb-4 ml-2">Open Positions</h3>
                    <PositionsDashboard positions={positions} isLoading={isLoading} />
                </motion.div>

            </div>
        </div>
    );
}
