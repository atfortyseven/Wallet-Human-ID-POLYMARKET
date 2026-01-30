"use client";

import React, { useState } from 'react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { AccountSwitcher } from './wallet/AccountSwitcher';
import { WalletActions } from './wallet/WalletActions';
import { NetworkSelector } from './wallet/NetworkSelector';
import { Search, Info } from 'lucide-react';

export default function WalletSection() {
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    if (!isConnected) {
        return <div className="p-10 text-center text-white">Please connect your wallet.</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-40">
            {/* LOBBY HEADER: Account & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 relative z-50">
                {/* Left: Account Switcher */}
                <div className="self-start md:self-auto">
                     <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-4 mb-1">CUENTA ACTUAL</div>
                     <AccountSwitcher />
                </div>

                {/* Center/Right: "Cuentas" Search */}
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                     <div className="text-center text-white font-bold text-lg mb-2 drop-shadow-md">Cuentas</div>
                     <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-hover:text-white transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar en mis cuentas..." 
                            className="
                                w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-full 
                                py-2 pl-10 pr-4 text-sm text-white 
                                focus:outline-none focus:border-blue-500/50 focus:bg-white/10
                                transition-all duration-300 shadow-lg
                            "
                        />
                     </div>
                </div>
            </div>

            {/* MAIN DASHBOARD CONTENT */}
            <div className="flex flex-col items-center relative z-40 animate-fade-in-up">
                
                {/* TOTAL BALANCE DISPLAY */}
                <div className="text-center mb-10 scale-100 hover:scale-[1.02] transition-transform duration-500 cursor-default">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/60 mb-2 border border-white/5">
                        <Info size={12} /> Balance Total Estimado
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                        $0.00
                    </h1>
                    <div className="text-green-400 font-mono mt-2 flex items-center justify-center gap-2">
                        <span>+$0.00 (0.00%)</span>
                        <span className="text-white/20">|</span>
                        <span className="text-white/40">Hoy</span>
                    </div>
                </div>

                {/* ACTION GRID (Buy, Send, etc.) & TABS */}
                <div className="w-full">
                    <WalletActions />
                </div>

                {/* NETWORK SELECTOR (Placed below Tokens as requested) */}
                <div className="w-full mt-4">
                     <NetworkSelector />
                </div>

                {/* Extra Space for Scroll */}
                <div className="h-20" />
            </div>
        </div>
    );
}
