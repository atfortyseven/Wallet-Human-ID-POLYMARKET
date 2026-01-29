'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Globe, Vote, Lock, AlertTriangle, TrendingUp, TrendingDown, Target, Wallet, Cpu, Fish, Banknote } from 'lucide-react';
import { toast } from 'sonner';

// Import Custom Hooks
import { useAiSentiment } from '@/hooks/useAiSentiment';
import { useGasMatrix } from '@/hooks/useGasMatrix';
import { useGovSniper } from '@/hooks/useGovSniper';
import { useYieldHunter } from '@/hooks/useYieldHunter';

// Import 3D Core
// IdentityCore moved to VoidShell for global background
import { Constellation } from '../history/Constellation';
import { ZapButton } from '@/components/defi/ZapButton'; // [NEW] Phase 3
import { RefuelStation } from '@/components/defi/RefuelStation'; // [NEW] Phase 3

type FeedMode = 'LIVE' | 'HISTORY' | 'WHALES' | 'GAS' | 'GOV' | 'YIELD';

export function IntelFeed() {
    // --- Hook Integration ---
    const sentiment = useAiSentiment();
    const gas = useGasMatrix();
    const gov = useGovSniper();
    const yieldData = useYieldHunter();

    // --- Local State ---
    const [mode, setMode] = useState<FeedMode>('LIVE');

    // --- Helper for Gas Color ---
    const getGasColor = (fee: number) => {
        if (fee < 15) return 'text-emerald-400';
        if (fee < 30) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">

            {/* --- GRID BACKGROUND (Static) --- */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 z-20">
                <div>
                    <div className="text-[10px] font-mono text-emerald-500 tracking-widest mb-1 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        SYSTEM_CORE // ACTIVE
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 tracking-widest">
                        v3.0.1
                    </div>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL (Z-20) --- */}
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">

                {/* Espacio vacío arriba para ver el 3D */}
                <div className="flex-1 min-h-[150px] flex items-center justify-center pointer-events-none">
                    {/* El 3D vive aquí visualmente */}
                </div>

                {/* --- SELECTOR DE PESTAÑAS --- */}
                <div className="flex justify-center gap-4 py-2 overflow-x-auto px-4 custom-scrollbar">
                    {['LIVE', 'HISTORY', 'WHALES', 'GAS', 'GOV', 'YIELD'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setMode(tab as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap z-20 ${mode === tab
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* --- CONTENIDO DE DATOS (SCROLLABLE) --- */}
                <div className="flex-1 p-4 overflow-y-auto relative z-20 custom-scrollbar">
                    <AnimatePresence mode='wait'>

                        {/* --- TAB: LIVE (Sentiment & General) --- */}
                        {mode === 'LIVE' && (
                            <motion.div
                                key="live"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {/* Sentiment Card */}
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
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
                            </motion.div>
                        )}

                        {/* --- TAB: HISTORY (Constellation) --- */}
                        {mode === 'HISTORY' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm"
                            >
                                <Constellation />
                            </motion.div>
                        )}

                        {/* --- TAB: WHALES (Placeholder/Future) --- */}
                        {mode === 'WHALES' && (
                            <motion.div
                                key="whales"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2 p-8"
                            >
                                <Fish size={32} className="text-violet-500 opacity-50" />
                                <p className="text-xs font-mono">WHALE TRACKING SYSTEM</p>
                                <p className="text-[10px] text-zinc-600 text-center">Monitoring large scale movements across the chain. <br />(Module Initializing...)</p>
                            </motion.div>
                        )}

                        {/* --- TAB: GAS (Gas Matrix) --- */}
                        {mode === 'GAS' && (
                            <motion.div
                                key="gas"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                            <Zap size={14} /> GAS MATRIX
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <RefuelStation gasLevel={0.5} /> {/* [NEW] Phase 3: Simulated Low Gas */}
                                            <span className="text-[10px] font-mono text-zinc-600">EIP-1559 REALTIME</span>
                                        </div>
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
                                    <div className="text-center">
                                        <span className={`text-[10px] px-2 py-1 rounded border ${gas.congestion === 'CLOGGED' || gas.congestion === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            NETWORK STATUS: {gas.congestion}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB: GOV (Governance) --- */}
                        {mode === 'GOV' && (
                            <motion.div
                                key="gov"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
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
                                        <div key={prop.id} className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex justify-between items-center group hover:bg-amber-900/20 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">{prop.dao}</span>
                                                    <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                                                        <AlertTriangle size={10} /> ENDS IN {prop.endsInHours}H
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-white max-w-[180px] truncate">{prop.title}</h4>
                                            </div>
                                            <button
                                                onClick={() => toast.success(`Voted FOR on ${prop.id}`)}
                                                className="p-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg transition-colors shadow-lg shadow-amber-900/20"
                                            >
                                                <Vote size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* --- TAB: YIELD (DeFi) --- */}
                        {mode === 'YIELD' && (
                            <motion.div
                                key="yield"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                                    <span><Wallet size={12} className="inline mr-1" /> Yield Opportunities</span>
                                    <span className="text-emerald-400">Top: {yieldData.topPick?.protocol}</span>
                                </div>

                                {yieldData.pools.map((pool, i) => (
                                    <div key={i} className="relative bg-white/5 border border-white/5 p-4 rounded-xl overflow-hidden group hover:border-emerald-500/30 transition-all">
                                        {/* Rank Number */}
                                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full flex items-end justify-start p-3 text-4xl font-bold text-white/5 group-hover:text-emerald-500/20 transition-colors">
                                            {i + 1}
                                        </div>

                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{pool.pool}</h4>
                                                <p className="text-xs text-zinc-400">{pool.protocol}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <div className="text-lg font-bold text-emerald-400 font-mono">{pool.apy}% APY</div>
                                                <div className="text-[10px] text-zinc-500">TVL: {pool.tvl}</div>
                                                <ZapButton poolName={pool.pool} apy={`${pool.apy}%`} /> {/* [NEW] Phase 3 */}
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

                    </AnimatePresence>
                </div>

                {/* --- TICKER FOOTER --- */}
                <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex justify-between items-center text-[10px] font-mono text-zinc-600 z-20">
                    <span>Updated: {new Date().toLocaleTimeString()}</span>
                    <span className="flex items-center gap-1">
                        <Lock size={10} /> ENCRYPTED
                    </span>
                </div>
            </div>
        </div>
    );
}
