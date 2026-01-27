"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/components/AppContext";
import SettingsMenu from "@/components/SettingsMenu";
import { MainVault } from "@/components/MainVault";
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
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { ProposeMarket } from "@/components/governance/ProposeMarket";
import { useAccount, useBalance, useConnect } from "wagmi";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

import { useTokenPrice } from "@/hooks/useTokenPrice";
import useSWR from "swr";
import { useHumanFi } from "@/hooks/useHumanFi";
import { formatEther } from "viem";
import { useProposals } from "@/hooks/useProposals";
import { useNetWorth } from "@/hooks/useNetWorth"; // New Hook
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"; // New Icons

// removed local formatCurrency
// const formatCurrency = ...  <-- Using global context instead

const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

export default function WalletSection() {
    // --- Global "Brain" Context ---
    const { formatMoney, t } = useApp();

    // --- Hooks de Blockchain ---
    const { address, isConnected, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { isAuthenticated } = useAuth(); // World ID authentication

    // Human-Fi Hook
    const {
        wldBalance,
        votingPower: governancePower,
        executeZap,
        claimFaucet,
        castVote,
        isPending: isHumanFiPending
    } = useHumanFi();

    const { price: wldPrice, isLoading: isPriceLoading } = useTokenPrice();
    const { proposals, isLoading: isLoadingProposals } = useProposals();

    // Fetch User Governance & Royalty Stats
    const { data: userStats } = useSWR(
        address ? `/api/user/stats?address=${address}` : null,
        (url) => fetch(url).then(r => r.json()),
        { refreshInterval: 10000 }
    );

    // Balance Nativo (ETH)
    const { data: balanceData } = useBalance({
        address: address,
    });

    // --- Estado ---
    const [activeTab, setActiveTab] = useState<'zap' | 'governance' | 'activity'>('zap');
    const [zapAmount, setZapAmount] = useState("");
    const [isZapping, setIsZapping] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Evitar hidratación incorrecta en Next.js
    useEffect(() => setMounted(true), []);

    // --- Datos Derivados ---
    const ethBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    // Usar balance real del hook (parseando BigInt a float)
    const wldVal = wldBalance ? parseFloat(formatEther(wldBalance as bigint)) : 0;

    // Real Data or Default
    const portfolioValue = (ethBalance * 2500) + (wldVal * (wldPrice || 0)); // ETH @ $2500 approx fixed for now

    // --- Dynamic Net Worth Logic ---
    const {
        percentage: netWorthPct,
        loading: isNetWorthLoading,
        fetchBalance: refreshNetWorth
    } = useNetWorth(address, ethBalance, wldVal, wldPrice);

    const unclaimedRoyalties = userStats?.unclaimedRoyalties || 0;
    const votingPower = userStats?.votingPower || 0;
    const activeProposals = userStats?.activeProposals || 0;
    // const isWorldIDVerified = isAuthenticated; // Use actual auth status - Removed redundancy
    const isWorldIDVerified = isAuthenticated;

    // --- Handlers ---
    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success("Address copied to clipboard");
        }
    };

    const handleConnect = () => {
        const connector = connectors[0]; // Logic to pick connector, usually injected or WalletConnect
        if (connector) {
            connect({ connector });
        } else {
            toast.error("No wallet connector found");
        }
    };

    const handleZap = async () => {
        if (!isConnected) {
            toast.error("Wallet not connected. Connecting...");
            handleConnect();
            return;
        }
        if (!zapAmount || parseFloat(zapAmount) <= 0) return;

        try {
            executeZap(zapAmount);
            // El hook maneja el state de loading via isHumanFiPending pero aquí tenemos isZapping local.
            // Idealmente deberíamos usar el del hook para el UI feedback.
            setZapAmount("");
            toast.success("Zap transaction initiated!");
        } catch (e) {
            console.error(e);
            toast.error("Zap failed");
        }
    };

    const setPercentage = (percent: number) => {
        setZapAmount((wldVal * percent).toFixed(2));
    };

    if (!mounted) return null;

    // Allow access if either wallet is connected OR World ID is authenticated
    if (!isConnected && !isAuthenticated) {
        return (
            <div className="w-full max-w-5xl mx-auto p-12 text-center">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 backdrop-blur-sm">
                    <Wallet className="w-16 h-16 text-neutral-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                    <p className="text-neutral-400 mb-8">Please sign in with World ID or connect your wallet to access the Void Terminal.</p>

                    <button
                        onClick={handleConnect}
                        className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Zap className="w-5 h-5" />
                        Conectar World ID
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-neutral-200">

            {/* --- HEADER: Identity Layer --- */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative p-3 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center gap-2">
                            <Wallet className="w-6 h-6 text-indigo-400" />
                            {/* Settings Menu Trigger */}
                            <div className="md:hidden">
                                <SettingsMenu />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Main Vault</h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                            {address ? (
                                <>
                                    <span>{formatAddress(address)}</span>
                                    <button onClick={handleCopy} className="hover:text-indigo-400 transition-colors"><Copy size={12} /></button>
                                </>
                            ) : (
                                <button
                                    onClick={handleConnect}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors"
                                >
                                    CONNECT WALLET
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${chain?.id === 11155420 ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
                        <span className="text-xs font-medium text-neutral-400">{chain?.name || "Unknown Network"}</span>
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

                    {/* Global Settings Menu */}
                    <div className="hidden md:block">
                        <SettingsMenu />
                    </div>
                </div>
            </header>

            {/* --- GRID PRINCIPAL --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Assets & Actions (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1. Portfolio Card (World ID Connected) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <MainVault />
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
                                            <p className="text-sm text-neutral-400 mb-4">Transforma WLD en tokens de gobernanza en una sola transacción.</p>

                                            {/* Faucet for Demo */}
                                            {wldVal < 5 && (
                                                <button
                                                    onClick={claimFaucet}
                                                    className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold hover:bg-yellow-500/20 transition-colors"
                                                >
                                                    💸 Get 10 Demo WLD
                                                </button>
                                            )}
                                        </div>

                                        {/* Input Box */}
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-4 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                                            <div className="flex justify-between text-xs text-neutral-500 mb-2 font-mono">
                                                <span>INPUT</span>
                                                <span>BAL: {wldVal.toFixed(2)} WLD</span>
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
                                                ≈ {zapAmount ? formatMoney(parseFloat(zapAmount) * wldPrice) : '$0.00'}
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
                                        className="h-full flex flex-col gap-4"
                                    >
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[300px]">
                                            {isLoadingProposals ? (
                                                <div className="flex justify-center py-8">
                                                    <Loader2 className="animate-spin text-neutral-500" />
                                                </div>
                                            ) : proposals.length > 0 ? (
                                                proposals.map((proposal) => (
                                                    <div key={proposal.id} className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 hover:border-indigo-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-white text-sm">{proposal.question}</h4>
                                                            <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                                                                {proposal.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-neutral-400 mb-4 line-clamp-2">{proposal.description}</p>

                                                        <div className="flex gap-2">
                                                            <div className="w-full">
                                                                <IDKitWidget
                                                                    app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                                                                    action={process.env.NEXT_PUBLIC_WLD_ACTION || "vote_proposal_1"} // Should be dynamic per proposal ideally
                                                                    signal={proposal.id} // Sign the proposal ID
                                                                    onSuccess={castVote}
                                                                    verification_level={VerificationLevel.Orb}
                                                                >
                                                                    {({ open }: { open: () => void }) => (
                                                                        <button
                                                                            onClick={open}
                                                                            disabled={!governancePower || governancePower === BigInt(0)}
                                                                            className={`w-full py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${!governancePower || governancePower === BigInt(0)
                                                                                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                                                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                                                                }`}
                                                                        >
                                                                            {!governancePower || governancePower === BigInt(0) ? "Zap WLD to Vote" : "🗳️ Vote with World ID"}
                                                                        </button>
                                                                    )}
                                                                </IDKitWidget>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-neutral-500 text-sm">
                                                    No active proposals. Be the first to create one!
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-2 border-t border-neutral-800">
                                            <ProposeMarket />
                                        </div>
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
                                <span className="text-white font-mono">{votingPower} VP</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-400">Active Props</span>
                                <span className="flex items-center gap-1 text-white">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeProposals > 0 ? 'bg-emerald-500' : 'bg-neutral-500'}`}></span>
                                    {activeProposals}
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
