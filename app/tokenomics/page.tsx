'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import { SupplyChart } from '@/components/tokenomics/SupplyChart';
import { AllocationDonut } from '@/components/tokenomics/AllocationDonut';
import { YieldSimulator } from '@/components/tokenomics/YieldSimulator';
import { TOKEN_METRICS } from '@/src/config/tokenomics';
import { Coins, Layers, PieChart as PieIcon } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

export default function TokenomicsPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">

            {/* HERO SECTION */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-16 text-center relative"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00f2ea]/10 blur-[120px] rounded-full pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 mb-6 relative z-10">
                    THE LEDGER
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base">
                    Strictly defined cryptographic supply. Immutable distribution. <br />
                    Designed for long-term alignment between <span className="text-[#00f2ea]">Intelligence</span> and <span className="text-[#7000ff]">Liquidity</span>.
                </p>
            </motion.div>

            {/* KEY METRICS */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full"><Coins size={24} className="text-[#00f2ea]" /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Supply</div>
                        <div className="text-2xl font-mono font-bold text-white">100,000,000 <span className="text-sm text-gray-500">{TOKEN_METRICS.ticker}</span></div>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full"><Layers size={24} className="text-[#7000ff]" /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">TGE Date</div>
                        <div className="text-2xl font-mono font-bold text-white">{TOKEN_METRICS.tgeDate}</div>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full"><PieIcon size={24} className="text-[#ff0055]" /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Initial Float</div>
                        <div className="text-2xl font-mono font-bold text-white">4.5% <span className="text-sm text-gray-500">at Launch</span></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* MAIN DASHBOARD GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* LEFT: Charts (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div variants={itemVariants}>
                        <SupplyChart />
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4">Vesting Policy</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                To ensure long-term stability, Team and Investor allocations are locked with a 12-month cliff followed by 24-36 month linear vesting. Community rewards are emitted logarithmically.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">NO VC DUMPING</span>
                                <span className="px-3 py-1 rounded-full bg-[#00ff9d]/10 text-[#00ff9d] text-xs font-bold border border-[#00ff9d]/20">AUDITED CONTRACTS</span>
                            </div>
                        </div>
                        <AllocationDonut />
                    </motion.div>
                </div>

                {/* RIGHT: Simulator (4 cols) */}
                <div className="lg:col-span-4">
                    <motion.div variants={itemVariants} className="h-full">
                        <YieldSimulator />

                        {/* DECORATIVE BLOCK */}
                        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/5 relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-20"><Coins size={120} /></div>
                            <h4 className="font-bold text-white mb-2 relative z-10">Staking Multiplier</h4>
                            <p className="text-xs text-gray-400 mb-4 relative z-10 w-3/4">
                                Lock your HMND for 12 months to receive a 2.5x multiplier on your governance power and yield share.
                            </p>
                            <button className="relative z-10 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                View Vaults
                            </button>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </main>
    );
}
