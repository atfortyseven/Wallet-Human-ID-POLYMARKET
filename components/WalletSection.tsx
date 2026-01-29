"use client";

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/components/AppContext";
import { MainVault } from "@/components/MainVault";
import { TokenPortfolio } from "@/components/dashboard/TokenPortfolio";
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
import { useFPMM } from "@/hooks/useFPMM"; // [NEW] Gnosis Hook
import { useCTF } from "@/hooks/useCTF"; // [NEW] Gnosis Hook
import { SoulRing } from "@/components/identity/SoulRing"; // [NEW] Identity Module

// removed local formatCurrency
// const formatCurrency = ...  <-- Using global context instead

const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

import { useSearchParams } from "next/navigation"; // Import

// ... (existing imports)

export default function WalletSection() {
    // --- Global "Brain" Context ---
    const { formatMoney, t } = useApp();

    const searchParams = useSearchParams();
    const marketParam = searchParams.get('market') as `0x${string}` | null;

    // --- Hooks de Blockchain ---
    const { chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { isAuthenticated } = useAuth(); // World ID authentication

    // AppKit Hooks
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

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
        address: address as `0x${string}` | undefined,
    });

    // --- Estado ---
    const [activeTab, setActiveTab] = useState<'governance' | 'activity'>('governance');
    const [zapAmount, setZapAmount] = useState("");
    const [selectedOutcome, setSelectedOutcome] = useState<0 | 1>(0); // 0 = YES, 1 = NO
    const [mounted, setMounted] = useState(false);

    // [NEW] FPMM Hook (Market Maker)
    // Priority: URL Param > Env Var > Default Zero
    const activeMarketAddress = marketParam || process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";

    // Pass active address to hook
    const { buy, isPending: isTrading } = useFPMM(activeMarketAddress);

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
        open({ view: 'Connect' });
    };

    // [NEW] CTF Hook (Redemption)
    const { redeemPositions, isPending: isRedeeming } = useCTF();

    const handleClaim = async () => {
        if (unclaimedRoyalties <= 0) {
            toast.error("No winnings to claim.");
            return;
        }
        try {
            // Mock Condition ID for now - in production this comes from the specific market
            const conditionId = "0x0000000000000000000000000000000000000000000000000000000000000000";
            redeemPositions(conditionId); // Note: This function requires string input for amount in useCTF logic? Wait, redeemPositions only takes conditionId in the hook implementation I wrote.
            // Let's check hook signature. It takes conditionId.
            toast.success("Redemption transaction sent!");
        } catch (e) {
            console.error(e);
            toast.error("Redemption failed");
        }
    };

    const handleTrade = async () => {
        if (!isConnected) {
            toast.error("Wallet not connected. Connecting...");
            handleConnect();
            return;
        }
        if (!zapAmount || parseFloat(zapAmount) <= 0) return;

        try {
            // Calculate Min Amount (Slippage protection) - Mocked for now to 0
            const minTokens = BigInt(0);
            // Buy using the hook's context (which uses activeMarketAddress)
            await buy(zapAmount, selectedOutcome, minTokens, activeMarketAddress); // Explicitly passing address just in case, though hook defaults to it

            setZapAmount("");
            toast.success(`Buying ${selectedOutcome === 0 ? 'YES' : 'NO'} positions...`);
        } catch (e) {
            console.error(e);
            toast.error("Trade failed");
        }
    };

    const setPercentage = (percent: number) => {
        setZapAmount((wldVal * percent).toFixed(2));
    };

    const handleStandardConnect = () => {
        open({ view: 'Connect' });
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

                    <div className="flex flex-col gap-4 max-w-xs mx-auto">
                        <button
                            onClick={() => open()}
                            className="w-full px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <Wallet className="w-5 h-5" />
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-[var(--text-primary)]">

            {/* --- HEADER: Identity Layer --- */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        {/* SoulRing Wrapper */}
                        <SoulRing>
                            <div className="relative p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full flex items-center justify-center w-12 h-12">
                                <Wallet className="w-5 h-5 text-indigo-400" />
                            </div>
                        </SoulRing>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Main Vault</h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
                            {address ? (
                                <>
                                    <span>{formatAddress(address)}</span>
                                    <button onClick={() => open()} className="hover:text-indigo-400 transition-colors"><Copy size={12} /></button>
                                </>
                            ) : (
                                <button
                                    onClick={() => open()}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors"
                                >
                                    {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "CONNECT WALLET"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3">
                    {/* Network Badge Removed as per user request (moved to MainVault) */}
                    {/* World ID Badge Removed as per user request */}
                    {/* Global Settings Menu Removed - Moved to VoidShell */}
                </div>
            </header >

            {/* --- GRID PRINCIPAL --- */}
            < div className="grid grid-cols-1 lg:grid-cols-12 gap-6" >

                {/* LEFT COLUMN: Assets & Actions (8 cols) */}
                < div className="lg:col-span-8 space-y-6" >

                    {/* 1. Portfolio Card (World ID Connected) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <MainVault onConnect={handleStandardConnect} />
                    </motion.div>

                    {/* [NEW] Token Portfolio Section */}
                    <TokenPortfolio />

                    {/* 2. Action Center (Tabs + Content) */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
                        {/* Tabs Header */}
                        <div className="flex border-b border-[var(--border-main)]">
                            {['governance', 'activity'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className="relative flex-1 py-4 text-xs md:text-sm font-medium transition-colors outline-none"
                                >
                                    <span className={`relative z-10 tracking-widest ${activeTab === tab ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                        {tab.toUpperCase()}
                                    </span>
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[var(--bg-surface)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-8 flex-1 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeTab === 'governance' ? (
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
                        </div >
                    </div >
                </div >

                {/* RIGHT COLUMN: Rewards & Info (4 cols) */}
                < div className="lg:col-span-4 space-y-6" >

                    {/* Rewards Card - The "Gold" Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-amber-900/30 p-6 h-[400px] flex flex-col"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <Gift size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] tracking-wide">ROYALTIES</h3>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="mb-2 text-amber-500 text-sm font-medium tracking-widest">CLAIMABLE</div>
                            <div className="text-4xl font-mono font-bold text-[var(--text-primary)] mb-1">
                                ${unclaimedRoyalties.toFixed(2)}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">USDC</div>

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



                        <button
                            onClick={handleClaim}
                            disabled={isRedeeming || unclaimedRoyalties <= 0}
                            className="w-full mt-auto py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isRedeeming ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    CLAIMING...
                                </>
                            ) : (
                                <>
                                    RECLAMAR
                                    <ArrowRightLeft size={16} />
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Info / Governance Widget */}
                    <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-[var(--text-primary)]">Governance</span>
                            <ExternalLink size={14} className="text-[var(--text-muted)]" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--text-muted)]">Voting Power</span>
                                <span className="text-[var(--text-primary)] font-mono">{votingPower} VP</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--text-muted)]">Active Props</span>
                                <span className="flex items-center gap-1 text-[var(--text-primary)]">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeProposals > 0 ? 'bg-emerald-500' : 'bg-neutral-500'}`}></span>
                                    {activeProposals}
                                </span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-[var(--border-main)]">
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    <Info size={10} className="inline mr-1" />
                                    Next proposal cycle starts in 2 days.
                                </p>
                            </div>
                        </div>
                    </div>

                </div >
            </div >
        </div >
    );
}
