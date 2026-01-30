"use client";

import React, { useState } from 'react';
import { ChevronDown, Layers, Search } from 'lucide-react';

const NETWORKS = {
    popular: [
        { name: "Ethereum", color: "bg-[#627EEA]" },
        { name: "Linea", color: "bg-black border border-white/20" },
        { name: "Base", color: "bg-[#0052FF]" },
        { name: "Arbitrum", color: "bg-[#2D374B]" },
        { name: "BNB Chain", color: "bg-[#F3BA2F]" },
        { name: "OP Mainnet", color: "bg-[#FF0420]" },
        { name: "Polygon", color: "bg-[#8247E5]" },
    ],
    additional: [
        { name: "Avalanche", color: "bg-[#E84142]" },
        { name: "HyperEVM", color: "bg-purple-600" },
        { name: "Monad", color: "bg-[#814CCD]" },
        { name: "Sei", color: "bg-[#A73336]" },
        { name: "zkSync Era", color: "bg-[#FFFFFF] text-black" },
    ]
};

export function NetworkSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(NETWORKS.popular[0]);

    return (
        <div className="w-full max-w-md mx-auto relative z-40 my-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-full flex items-center justify-between px-5 py-3.5 rounded-2xl
                    bg-neutral-900 shadow-xl border border-neutral-800
                    hover:bg-black transition-all group hover:scale-[1.01] active:scale-[0.99]
                "
            >
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${selected.color} shadow-[0_0_10px_currentColor]`} />
                    <span className="text-white font-bold text-lg tracking-tight">{selected.name}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                    <span className="text-xs font-bold uppercase tracking-widest">Network</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Mega Menu Dropdown */}
            {isOpen && (
                <div className="
                    absolute bottom-full left-0 mb-3 w-full
                    bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10
                    rounded-3xl shadow-2xl p-5 overflow-hidden
                    animate-in fade-in slide-in-from-bottom-2 duration-200
                ">
                    {/* Search */}
                    <div className="relative mb-5">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input 
                            type="text" 
                            placeholder="Find network..." 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 focus:bg-black transition-all"
                        />
                    </div>

                    <div className="flex gap-6">
                        {/* Column 1: Popular */}
                        <div className="flex-1">
                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-3 pl-2">Popular</div>
                            <div className="space-y-1">
                                {NETWORKS.popular.map((net) => (
                                    <button 
                                        key={net.name}
                                        onClick={() => { setSelected(net); setIsOpen(false); }}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${net.color} group-hover:scale-125 transition-transform`} />
                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white">{net.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Additional/Custom */}
                        <div className="flex-1 border-l border-white/5 pl-6">
                             <div className="flex items-center justify-between mb-3 px-1">
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Others</div>
                                <button className="text-[10px] text-blue-500 font-bold hover:text-blue-400 transition-colors">+ Custom</button>
                             </div>
                             <div className="space-y-1">
                                {NETWORKS.additional.map((net) => (
                                    <button 
                                        key={net.name}
                                        onClick={() => { setSelected(net); setIsOpen(false); }}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${net.color} group-hover:scale-125 transition-transform`} />
                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white">{net.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
