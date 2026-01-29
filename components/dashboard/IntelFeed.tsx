'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Globe, Vote, Lock, AlertTriangle, TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import { toast } from 'sonner';

// Import Custom Hooks
import { useAiSentiment } from '@/hooks/useAiSentiment';
import { useGasMatrix } from '@/hooks/useGasMatrix';
import { useGovSniper } from '@/hooks/useGovSniper';
import { useYieldHunter } from '@/hooks/useYieldHunter';

export function IntelFeed() {
    // --- Hook Integration ---
    const sentiment = useAiSentiment();
    const gas = useGasMatrix();
    const gov = useGovSniper();
    const yieldData = useYieldHunter();

    // --- Local State ---
    const [activeTab, setActiveTab] = useState<'INTEL' | 'GOV' | 'DEFI'>('INTEL');

    // --- Helper for Gas Color ---
    const getGasColor = (fee: number) => {
        if (fee < 15) return 'text-emerald-400';
        if (fee < 30) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[650px] shadow-2xl relative">

            {/* 1. Terminal Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Activity className="text-indigo-400" size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                            INTEL FEED v3.0
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        </h3>
                        {/* Dynamic Status based on Gas Forecast */}
                        <p className="text-[10px] font-mono flex items-center gap-2">
                            <span className="text-zinc-500">NET_STATUS:</span>
                            <span className={gas.congestion === 'CLOGGED' || gas.congestion === 'HIGH' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}>
                                {gas.congestion}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                    {['INTEL', 'GOV', 'DEFI'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative bg-black/20">
                {/* Matrix background effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:40px_40px] [background-position:center] opacity-20 pointer-events-none" />

                <div className="space-y-4 p-2 relative z-10">

                    {/* --- TAB: INTEL (Sentiment & Gas) --- */}
                    {activeTab === 'INTEL' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                            {/* Sentiment Card */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                        <Globe size={14} /> GLOBAL SENTIMENT
                                    </h4>
                                    <div className={`px-2 py-1 rounded text-xs font-bold border ${sentiment.score >= 50 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {sentiment.score}/100
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-sm font-bold ${sentiment.score >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {sentiment.state}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">
                                        {sentiment.isLoading ? 'Analyzing...' : `${sentiment.analysisCount} Headlines Scanned`}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {sentiment.keywords.map((word, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-zinc-300 flex items-center gap-1">
                                            #{word.tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Gas Matrix */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                        <Zap size={14} /> GAS MATRIX
                                    </h4>
                                    <span className="text-[10px] font-mono text-zinc-600">EIP-1559 SIMULATION</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                    <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                                        <div className="text-[10px] text-zinc-500 mb-1">ECO</div>
                                        <div className={`text-sm font-mono font-bold ${getGasColor(gas.eco)}`}>
                                            {gas.eco}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-black/40 rounded-lg border border-white/5 ring-1 ring-indigo-500/30">
                                        <div className="text-[10px] text-indigo-400 mb-1 font-bold">STD</div>
                                        <div className={`text-lg font-mono font-bold ${getGasColor(gas.std)}`}>
                                            {gas.std}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                                        <div className="text-[10px] text-zinc-500 mb-1">TURBO</div>
                                        <div className={`text-sm font-mono font-bold ${getGasColor(gas.turbo)}`}>
                                            {gas.turbo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB: GOV (Governance Sniper) --- */}
                    {activeTab === 'GOV' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                                <span><Target size={12} className="inline mr-1" /> Actionable Proposals</span>
                                <span className="text-indigo-400">{gov.count} Found</span>
                            </div>

                            {gov.proposals.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-xs">
                                    No urgent proposals found.
                                </div>
                            ) : (
                                gov.proposals.map(prop => (
                                    <div key={prop.id} className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl flex justify-between items-center group hover:bg-red-900/20 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">{prop.dao}</span>
                                                <span className="text-[10px] text-red-300 font-mono flex items-center gap-1">
                                                    <AlertTriangle size={10} /> ENDS IN {prop.endsInHours}H
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white max-w-[180px] truncate">{prop.title}</h4>
                                        </div>
                                        <button
                                            onClick={() => toast.success(`Voted FOR on ${prop.id}`)}
                                            className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors shadow-lg shadow-red-900/20"
                                        >
                                            <Vote size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* --- TAB: DEFI (Yield Hunter) --- */}
                    {activeTab === 'DEFI' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                                <span><Wallet size={12} className="inline mr-1" /> Yield Opportunities</span>
                                <span className="text-emerald-400">Top Pick: {yieldData.topPick?.protocol}</span>
                            </div>

                            {yieldData.pools.map((pool, i) => (
                                <div key={i} className="relative bg-white/5 border border-white/5 p-4 rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all">
                                    {/* Rank Number */}
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full flex items-end justify-start p-3 text-4xl font-bold text-white/5 group-hover:text-indigo-500/20 transition-colors">
                                        {i + 1}
                                    </div>

                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{pool.pool}</h4>
                                            <p className="text-xs text-zinc-400">{pool.protocol}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-emerald-400 font-mono">{pool.apy}% APY</div>
                                            <div className="text-[10px] text-zinc-500">TVL: {pool.tvl}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3 relative z-10">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pool.badge === 'SAFE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                pool.badge === 'DEGEN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    pool.badge === 'RISKY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {pool.badge}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono">
                                            Risk: {pool.riskScore}/10
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                <span>Updated: {new Date().toLocaleTimeString()}</span>
                <span className="flex items-center gap-1">
                    <Lock size={10} /> ENCRYPTED
                </span>
            </div>
        </div>
    );
}
