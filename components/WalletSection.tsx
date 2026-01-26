"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    ArrowRightLeft,
    TrendingUp,
    ShieldCheck,
    Zap,
    Loader2,
    Gift,
    Copy,
    ExternalLink,
    Info
} from "lucide-react";
import { ProposeMarket } from "@/components/governance/ProposeMarket";

// --- Utility: Formateador de Moneda Seguro ---
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);

const formatCrypto = (value: number, symbol: string) =>
    `${value.toFixed(4)} ${symbol}`;

export default function WalletSection() {
    // --- Estado ---
    const [activeTab, setActiveTab] = useState<'zap' | 'governance' | 'activity'>('zap');
    const [zapAmount, setZapAmount] = useState("");
    const [isZapping, setIsZapping] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Evitar hidratación incorrecta en Next.js
    useEffect(() => setMounted(true), []);

    // --- Datos Mock (Conectar a tus hooks) ---
    const portfolioValue = 12450.32;
    const wldBalance = 450.00;
    const wldPrice = 7.85; // Precio simulado
    const unclaimedRoyalties = 45.20;
    const isWorldIDVerified = true;
    const walletAddress = "0x71C...9A21";

    // --- Handlers ---
    const handleZap = async () => {
        if (!zapAmount || parseFloat(zapAmount) <= 0) return;
        setIsZapping(true);
        // Simular Tx
        await new Promise((r) => setTimeout(r, 2500));
        setIsZapping(false);
        setZapAmount("");
    };

    const setPercentage = (percent: number) => {
        setZapAmount((wldBalance * percent).toFixed(2));
    };

    if (!mounted) return null;

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-neutral-200">

            {/* --- HEADER: Identity Layer --- */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative p-3 bg-neutral-900 border border-neutral-800 rounded-2xl">
                            <Wallet className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Main Vault</h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                            <span>{walletAddress}</span>
                            <button className="hover:text-indigo-400 transition-colors"><Copy size={12} /></button>
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-neutral-400">Optimism Mainnet</span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 ${isWorldIDVerified
                            ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                        <ShieldCheck size={14} />
                        <span className="text-xs font-bold tracking-wide">
                            {isWorldIDVerified ? "WORLD ID VERIFIED" : "UNVERIFIED"}
                        </span>
                    </div>
                </div>
            </header>

            {/* --- GRID PRINCIPAL --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Assets & Actions (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1. Portfolio Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-neutral-800 p-8"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-neutral-400 font-medium text-sm">Net Worth Estimate</span>
                                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                    <TrendingUp size={14} />
                                    <span className="text-xs font-bold font-mono">+12.4%</span>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter font-mono mb-6">
                                {formatCurrency(portfolioValue)}
                            </h1>

                            {/* Mini Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">WLD Balance</p>
                                    <p className="text-lg font-mono text-white">{wldBalance.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">WLD Price</p>
                                    <p className="text-lg font-mono text-white">${wldPrice.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">24h Vol</p>
                                    <p className="text-lg font-mono text-white">$1.2M</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Action Center (Tabs + Content) */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
                        {/* Tabs Header */}
                        <div className="flex border-b border-neutral-800">
                            {['zap', 'governance', 'activity'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className="relative flex-1 py-4 text-xs md:text-sm font-medium transition-colors outline-none"
                                >
                                    <span className={`relative z-10 tracking-widest ${activeTab === tab ? 'text-white' : 'text-neutral-500'}`}>
                                        {tab.toUpperCase()}
                                    </span>
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-neutral-800"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-8 flex-1 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeTab === 'zap' ? (
                                    <motion.div
                                        key="zap-panel"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="h-full flex flex-col justify-center max-w-lg mx-auto"
                                    >
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-bold text-white mb-2">Atomic Zap</h3>
                                            <p className="text-sm text-neutral-400">Transforma WLD en tokens de gobernanza en una sola transacción.</p>
                                        </div>

                                        {/* Input Box */}
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-4 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                                            <div className="flex justify-between text-xs text-neutral-500 mb-2 font-mono">
                                                <span>INPUT</span>
                                                <span>BAL: {wldBalance} WLD</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={zapAmount}
                                                    onChange={(e) => setZapAmount(e.target.value)}
                                                    className="w-full bg-transparent text-3xl font-mono text-white focus:outline-none placeholder-neutral-700"
                                                />
                                                <span className="shrink-0 bg-neutral-800 text-white px-3 py-1 rounded-lg text-sm font-bold">WLD</span>
                                            </div>
                                            {/* USD Estimator */}
                                            <div className="text-right text-xs text-neutral-500 mt-2 font-mono">
                                                ≈ {zapAmount ? formatCurrency(parseFloat(zapAmount) * wldPrice) : '$0.00'}
                                            </div>
                                        </div>

                                        {/* Quick Percentages */}
                                        <div className="flex gap-2 mb-8">
                                            {[0.25, 0.5, 0.75, 1].map((pct) => (
                                                <button
                                                    key={pct}
                                                    onClick={() => setPercentage(pct)}
                                                    className="flex-1 py-2 text-xs font-mono font-medium rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                                                >
                                                    {pct * 100}%
                                                </button>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            onClick={handleZap}
                                            disabled={isZapping || !zapAmount}
                                            className="w-full group relative py-4 bg-white text-black rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                {isZapping ? (
                                                    <>
                                                        <Loader2 className="animate-spin" />
                                                        <span>EXECUTING...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className={`w-5 h-5 fill-black transition-transform duration-300 ${zapAmount ? 'group-hover:scale-125' : ''}`} />
                                                        <span>EJECUTAR ZAP</span>
                                                    </>
                                                )}
                                            </div>
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </button>

                                    </motion.div>
                                ) : activeTab === 'governance' ? (
                                    <motion.div
                                        key="governance-panel"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="h-full"
                                    >
                                        <ProposeMarket />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="activity-panel"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4"
                                    >
                                        <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800">
                                            <ArrowRightLeft className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-sm">No hay transacciones recientes en el indexador.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Rewards & Info (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Rewards Card - The "Gold" Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-amber-900/30 p-6 h-[400px] flex flex-col"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <Gift size={20} />
                            </div>
                            <h3 className="font-bold text-white tracking-wide">ROYALTIES</h3>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="mb-2 text-amber-500 text-sm font-medium tracking-widest">CLAIMABLE</div>
                            <div className="text-4xl font-mono font-bold text-white mb-1">
                                ${unclaimedRoyalties.toFixed(2)}
                            </div>
                            <div className="text-xs text-neutral-500">USDC</div>

                            {/* Visualizer Abstracto */}
                            <div className="flex items-end justify-center gap-1 h-16 mt-8 w-full px-8 opacity-50">
                                {[40, 70, 45, 90, 60, 30, 50].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                                        className="w-1.5 bg-gradient-to-t from-amber-600 to-amber-300/50 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>

                        <button className="w-full mt-auto py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all flex justify-center items-center gap-2">
                            RECLAMAR
                            <ArrowRightLeft size={16} />
                        </button>
                    </motion.div>

                    {/* Info / Governance Widget */}
                    <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-white">Governance</span>
                            <ExternalLink size={14} className="text-neutral-500" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-400">Voting Power</span>
                                <span className="text-white font-mono">1,250 VP</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-400">Active Props</span>
                                <span className="flex items-center gap-1 text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    3
                                </span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-neutral-800">
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    <Info size={10} className="inline mr-1" />
                                    Next proposal cycle starts in 2 days.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
