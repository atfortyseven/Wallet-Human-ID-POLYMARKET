"use client";

import React, { useState } from 'react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { AccountSwitcher } from './wallet/AccountSwitcher';
import { WalletActions } from './wallet/WalletActions';
import { NetworkSelector } from './wallet/NetworkSelector';
import { CommunityInfo } from './CommunityInfo';
import { Search, Info } from 'lucide-react';

export default function WalletSection() {
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    if (!isConnected) {
        return <div className="p-10 text-center text-neutral-500 font-medium">Please connect your wallet to view this section.</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-40">
            {/* LOBBY HEADER: Account & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 relative z-50">
                {/* Left: Account Switcher */}
                <div className="self-start md:self-auto space-y-1">
                     <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest ml-4">CUENTA ACTUAL</div>
                     <AccountSwitcher />
                </div>

                {/* Center/Right: "Cuentas" Search */}
                <div className="relative w-full md:w-auto md:min-w-[320px]">
                     <div className="text-center text-neutral-800 font-bold text-xl mb-3 tracking-tight">Cuentas</div>
                     <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar en mis cuentas..." 
                            className="
                                w-full bg-white/60 border border-neutral-200/50 backdrop-blur-xl rounded-2xl 
                                py-3 pl-12 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400
                                focus:outline-none focus:border-neutral-400 focus:bg-white/80 focus:shadow-lg
                                transition-all duration-300 shadow-sm
                            "
                        />
                     </div>
                </div>
            </div>

            {/* MAIN DASHBOARD CONTENT */}
            <div className="flex flex-col items-center relative z-40 animate-fade-in-up">
                
                {/* TOTAL BALANCE DISPLAY */}
                <div className="text-center mb-12 scale-100 hover:scale-[1.02] transition-transform duration-500 cursor-default">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-neutral-200/50 text-xs font-semibold text-neutral-600 mb-4 shadow-sm">
                        <Info size={12} className="text-neutral-400" /> Balance Total Estimado
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter drop-shadow-sm">
                        $0.00
                    </h1>
                    <div className="text-green-600 font-mono font-medium mt-3 flex items-center justify-center gap-3 bg-green-100/50 px-4 py-1 rounded-full w-fit mx-auto border border-green-200/50">
                        <span>+$0.00 (0.00%)</span>
                        <span className="text-neutral-300">|</span>
                        <span className="text-neutral-500">Hoy</span>
                    </div>
                </div>

                {/* ACTION GRID (Buy, Send, etc.) & TABS */}
                <div className="w-full">
                    {/* Community Info Cards - 20 Lottie Animations */}
                    <CommunityInfo />
                    
                    <WalletActions />
                </div>

                {/* NETWORK SELECTOR */}
                <div className="w-full mt-8">
                     <NetworkSelector />
                </div>

                {/* Extra Space for Scroll */}
                <div className="h-24" />
            </div>
        </div>
    );
}
