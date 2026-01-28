'use client';

import React from 'react';
import { usePaperTrading } from '@/hooks/usePaperTrading';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, RefreshCcw, TrendingUp } from 'lucide-react';

export const PortfolioDashboard = () => {
    const { portfolio, resetPortfolio } = usePaperTrading();
    const isProfit = portfolio.totalPnL >= 0;

    return (
        <div className="w-full glass p-6 rounded-xl border border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-[50%] h-[50%] blur-[100px] rounded-full opacity-20 ${isProfit ? 'bg-[#00ff9d]' : 'bg-red-500'}`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-xs font-mono text-[#888899] uppercase tracking-widest mb-1">Virtual Equity</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            ${portfolio.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded ${isProfit ? 'bg-[#00ff9d]/10 text-[#00ff9d]' : 'bg-red-500/10 text-red-500'}`}>
                            {isProfit ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                            {portfolio.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} vUSD
                        </span>
                    </div>
                </div>

                <button
                    onClick={resetPortfolio}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#888899] hover:text-white"
                    title="Reset Simulation"
                >
                    <RefreshCcw size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-3 rounded bg-black/40 border border-white/5">
                    <div className="text-[10px] text-[#666] uppercase mb-1">Available Margin</div>
                    <div className="text-lg font-mono text-[#00f2ea]">
                        ${portfolio.balance.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 rounded bg-black/40 border border-white/5">
                    <div className="text-[10px] text-[#666] uppercase mb-1">Active Positions</div>
                    <div className="text-lg font-mono text-white flex items-center gap-2">
                        {portfolio.positions.length}
                        {portfolio.positions.length > 0 && <span className="animate-pulse w-2 h-2 rounded-full bg-[#00ff9d]"></span>}
                    </div>
                </div>
            </div>

            {/* Simulated Active Positions List (Mini) */}
            {portfolio.positions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] text-[#444] uppercase mb-2">Live Orders</div>
                    <div className="space-y-2">
                        {portfolio.positions.slice(0, 3).map(pos => (
                            <div key={pos.id} className="flex justify-between items-center text-xs">
                                <span className="text-white font-mono">{pos.type} / {pos.marketId.substring(0, 6)}...</span>
                                <span className="text-[#888899]">${pos.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
