"use client";

import React, { useState } from 'react';
import { Wallet, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { AccountSwitcher } from '@/components/wallet/AccountSwitcher';
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

    // Unified connection check (already handles both web3 and auth in the hook)
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-neutral-950 text-white p-6">
                 <div className="w-full max-w-md mx-auto space-y-8">
                     <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800 shadow-xl">
                            <Wallet className="w-8 h-8 text-neutral-500" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                        <p className="text-neutral-400">Connect your wallet to access your Main Vault.</p>
                     </div>
                     <div className="flex justify-center">
                        <AccountSwitcher /> 
                     </div>
                 </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 pb-20"> {/* Light/Neutral background as per new design hints in components? Or stick to dark? Prompt image was 'clean web3 wallet', usually dark or clean light. Previous SuperWallet was black. WalletActions seems designed for Light (white cards). I will use a clean neutral background compatible with both or a soft gradient. */}
            
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <AccountSwitcher />
                    <NetworkSelector />
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8">

                {/* Balance Section */}
                <div className="text-center space-y-2 py-8 animate-fade-in-up">
                    <h2 className="text-neutral-500 font-medium text-sm uppercase tracking-widest">Total Balance</h2>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter">
                            ${totalBalance}
                        </span>
                    </div>
                    
                    {/* 24h Change Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
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


