'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZap } from '@/hooks/useZap';
import { Zap, Loader2, CheckCircle2, Lock, ArrowRightLeft, Sprout } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ZapButton({ poolName, apy }: { poolName: string, apy: string }) {
    const { status, zapIn } = useZap();
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');

    const handleZapClick = () => {
        setShowModal(true);
    };

    const executeZap = async () => {
        await zapIn(poolName, amount || '100');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => setShowModal(false), 3000); // Close after completion
    };

    return (
        <>
            <button
                onClick={handleZapClick}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-105 transition-all text-sm flex items-center gap-2"
            >
                <Zap size={16} className="fill-black" />
                ZAP {apy}
            </button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0D0D12] border border-emerald-500/30 rounded-3xl p-6 w-full max-w-sm relative overflow-hidden"
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                            <h3 className="text-xl font-bold text-white mb-1 relative z-10 flex items-center gap-2">
                                <Zap className="text-emerald-400" />
                                ZAP into {poolName}
                            </h3>
                            <p className="text-xs text-zinc-500 mb-6 relative z-10">One-click yield farming automation.</p>

                            {status === 'IDLE' ? (
                                <div className="space-y-4 relative z-10">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                        <label className="text-[10px] text-zinc-400 mb-1 block">AMOUNT (USDC)</label>
                                        <input
                                            type="number"
                                            placeholder="1000"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-transparent text-2xl font-mono text-emerald-400 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={executeZap}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors"
                                    >
                                        CONFIRM ZAP
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="w-full py-2 text-xs text-zinc-500 hover:text-white">
                                        CANCEL
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 relative z-10 font-mono text-sm">
                                    {/* STEP 1: UNLOCK */}
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${status === 'UNLOCKING' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : (status === 'SWAPPING' || status === 'STAKING' || status === 'COMPLETED') ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-700' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                        {(status === 'SWAPPING' || status === 'STAKING' || status === 'COMPLETED') ? <CheckCircle2 size={18} /> : status === 'UNLOCKING' ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                                        <span>1. Unlocking Token</span>
                                    </div>

                                    {/* STEP 2: SWAP */}
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${status === 'SWAPPING' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : (status === 'STAKING' || status === 'COMPLETED') ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-700' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                        {(status === 'STAKING' || status === 'COMPLETED') ? <CheckCircle2 size={18} /> : status === 'SWAPPING' ? <Loader2 size={18} className="animate-spin" /> : <ArrowRightLeft size={18} />}
                                        <span>2. Swapping Assets</span>
                                    </div>

                                    {/* STEP 3: FARM */}
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${status === 'STAKING' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : status === 'COMPLETED' ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-700' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                        {status === 'COMPLETED' ? <CheckCircle2 size={18} /> : status === 'STAKING' ? <Loader2 size={18} className="animate-spin" /> : <Sprout size={18} />}
                                        <span>3. Farming Yield</span>
                                    </div>

                                    {status === 'COMPLETED' && (
                                        <div className="text-center text-emerald-400 text-xs mt-4 animate-pulse">
                                            TRANSACTION COMPLETED
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
