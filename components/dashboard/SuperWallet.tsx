"use client";

import React, { useState } from 'react';
import { Wallet, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { WalletActions } from '@/components/wallet/WalletActions';
import { useRealWalletData } from '@/hooks/useRealWalletData';

export default function SuperWallet({ recentNews = [] }: { recentNews?: any[] }) {
    
    // Data Hook (Real Logic)
    const {
        usdcBalance,
        totalBalance,
        portfolioValue,
        positions,
        transactions,
        isLoading,
        isConnected,
        address
    } = useRealWalletData(recentNews);

    // Always show the wallet interface
    return (
        <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans selection:bg-[#1F1F1F] selection:text-[#EAEADF] pb-20 relative overflow-hidden">
             {/* Background Noise/Void Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black rounded-full blur-[120px]" />
            </div>

            <main className="max-w-4xl mx-auto p-6 space-y-8 relative z-10">

                {/* Balance Section */}
                <div className="text-center space-y-2 py-8 animate-fade-in-up">
                    <h2 className="text-[#1F1F1F]/60 font-medium text-sm uppercase tracking-widest">Total Balance</h2>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-5xl md:text-6xl font-black text-[#1F1F1F] tracking-tighter">
                            ${totalBalance}
                        </span>
                    </div>
                    
                    {/* 24h Change Badge - Remove green color */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-[#1F1F1F] text-sm font-bold border border-[#1F1F1F]/10 shadow-sm">
                         <TrendingUp size={14} />
                         <span>+$0.00 (0.00%)</span> {/* Mock currently, as per instruction to leave structure ready */}
                    </div>
                </div>

                {/* Wallet Actions & Tabs */}
                <WalletActions positions={positions} history={transactions} />

            </main>
        </div>
    );
}


