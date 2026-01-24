"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Activity,
    ShieldCheck,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { useAccount } from "wagmi";
import { useMarketData } from "@/hooks/useMarketData";
import { usePolymarketSession } from "@/hooks/usePolymarketSession";
import { usePolymarketOrderbook } from "@/hooks/usePolymarketOrderbook";
import { usePolymarketTrade } from "@/hooks/usePolymarketTrade";
import SendModal from "@/components/wallet/SendModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";
import { Toaster } from "sonner";

// --- ANIMATION VARIANTS (Strict Typing) ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
};

// MARKET ID for "Will Trump Win?" (Example) or pass as prop
const MARKET_ID = "21742633143463906290569050155826241533067272736897614950488156847949938836455";
const TOKEN_ID_YES = "21742633143463906290569050155826241533067272736897614950488156847949938836455"; // Usually calculated (conditionId + index)
const TOKEN_ID_NO = "21742633143463906290569050155826241533067272736897614950488156847949938836456";

export default function PolymarketGlassDashboard() {
    const { address } = useAccount();
    const { isProxyEnabled, login } = usePolymarketSession();
    const { portfolioValue, usdcBalance } = useMarketData(); // Keep visual data from here for now

    // Real Data Hooks
    const { orderBook, isLoading: isBookLoading } = usePolymarketOrderbook(MARKET_ID);
    const { trade, status: tradeStatus } = usePolymarketTrade();

    const [side, setSide] = useState<"YES" | "NO">("YES");
    const [amount, setAmount] = useState("");

    // Modals
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const handleTrade = () => {
        const tokenId = side === "YES" ? TOKEN_ID_YES : TOKEN_ID_NO;
        // Current best price logic (simplified)
        const bestPrice = side === "YES"
            ? (orderBook.asks[0]?.price || 0.5)
            : (1 - (orderBook.bids[0]?.price || 0.5)); // Approx

        trade("BUY", amount, bestPrice, tokenId);
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="min-h-screen w-full p-4 md:p-8 text-white font-sans selection:bg-indigo-500/30"
        >
            <Toaster position="bottom-right" theme="dark" richColors />

            <SendModal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />
            <ReceiveModal isOpen={isReceiveOpen} onClose={() => setIsReceiveOpen(false)} />

            {/* A. THE GLASS HEADER */}
            <motion.header
                variants={itemVariants}
                className="sticky top-4 z-50 mb-8 w-full max-w-7xl mx-auto"
            >
                <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <span className="text-sm font-medium tracking-wide text-white/90">Polygon Synced</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/20 border border-white/5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-mono text-white/70">
                                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* B. PORTFOLIO INSIGHT (HERO) */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
                    <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                            <Activity className="w-32 h-32 text-indigo-500" />
                        </div>

                        <h2 className="text-sm uppercase tracking-[0.2em] text-white/50 font-bold mb-2">Total Portfolio Value</h2>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                ${portfolioValue}
                            </span>
                        </div>

                        <div className="mt-8 flex space-x-8 items-end">
                            <div className="flex-1">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Available USDC</p>
                                <p className="text-xl font-medium text-emerald-400">${usdcBalance}</p>
                            </div>

                            {/* NEW: Send/Receive Buttons */}
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
                    </div>

                    {/* MOCK CHART AREA PLACEHOLDER */}
                    <div className="h-64 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-md flex items-center justify-center">
                        <p className="text-white/20 text-sm tracking-widest uppercase">Market Performance Graph</p>
                    </div>
                </motion.div>

                {/* C. THE TRADING TERMINAL */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">

                    {/* PROXY CHECKER */}
                    {!isProxyEnabled && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                                <h3 className="text-sm font-bold text-amber-500">Trading Disabled</h3>
                                <p className="text-xs text-white/60 mt-1 mb-2">You need a Proxy Wallet to trade on Polymarket.</p>
                                <button
                                    onClick={login}
                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
                                >
                                    Enable Trading
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-6 rounded-[32px] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            <span>Order Book</span>
                        </h3>

                        {/* VISUAL ORDERBOOK */}
                        <div className="space-y-1 mb-8 font-mono text-sm">
                            {(isBookLoading && orderBook.asks.length === 0) && (
                                <div className="text-center py-4 text-white/30">Loading Market Data...</div>
                            )}

                            {/* ASKS (SELLERS) - RED */}
                            <div className="space-y-1 bg-red-500/5 p-2 rounded-xl">
                                {orderBook.asks.slice(0, 3).reverse().map((ask, i) => (
                                    <div key={i} className="flex justify-between text-rose-400 relative">
                                        <span className="z-10">{parseFloat(ask.price.toString()).toFixed(2)}</span>
                                        <span className="z-10 text-white/40">{ask.size}</span>
                                        <div
                                            className="absolute right-0 top-0 h-full bg-rose-500/10 rounded-l-md"
                                            style={{ width: `${(ask.size / 6000) * 100}%` }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="py-2 text-center text-xs text-white/30 tracking-widest uppercase">Spread</div>

                            {/* BIDS (BUYERS) - GREEN */}
                            <div className="space-y-1 bg-emerald-500/5 p-2 rounded-xl">
                                {orderBook.bids.slice(0, 3).map((bid, i) => (
                                    <div key={i} className="flex justify-between text-emerald-400 relative">
                                        <span className="z-10">{parseFloat(bid.price.toString()).toFixed(2)}</span>
                                        <span className="z-10 text-white/40">{bid.size}</span>
                                        <div
                                            className="absolute right-0 top-0 h-full bg-emerald-500/10 rounded-l-md"
                                            style={{ width: `${(bid.size / 6000) * 100}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACTION PANEL */}
                        <div className="p-1 rounded-xl bg-white/5 flex mb-6">
                            <button
                                onClick={() => setSide("YES")}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${side === "YES" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"}`}
                            >
                                BUY YES
                            </button>
                            <button
                                onClick={() => setSide("NO")}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${side === "NO" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-white/40 hover:text-white"}`}
                            >
                                BUY NO
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Amount (USDC)</label>
                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-2xl font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/10"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <span className="text-xs font-bold text-white/30">USDC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs py-2 border-t border-white/5">
                                <span className="text-white/40">Est. Shares</span>
                                <span className="text-white font-mono">{amount ? (parseFloat(amount) / 0.65).toFixed(2) : "0.00"}</span>
                            </div>

                            <button
                                onClick={handleTrade}
                                disabled={tradeStatus === "APPROVING" || tradeStatus === "SIGNING" || tradeStatus === "POSTING" || !amount}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {tradeStatus === "APPROVING" && <><Loader2 className="animate-spin w-5 h-5" /> Approving...</>}
                                {tradeStatus === "SIGNING" && <><Loader2 className="animate-spin w-5 h-5" /> Sign Order...</>}
                                {tradeStatus === "POSTING" && <><Loader2 className="animate-spin w-5 h-5" /> Placing...</>}
                                {tradeStatus === "SUCCESS" && "Success!"}
                                {tradeStatus === "IDLE" && "Place Order"}
                            </button>
                        </div>

                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
