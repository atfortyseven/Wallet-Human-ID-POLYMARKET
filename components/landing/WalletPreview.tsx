"use client";

import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Search, MoreVertical, CreditCard, ArrowUpRight, ArrowDownLeft, Repeat } from 'lucide-react';

export function WalletPreview() {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll Logic:
    // 1.0 - 2.0: Fade In & Slide Up
    // 2.0 - 3.0: Stay visible
    // 3.0 - 4.0: "Close by parts" (Fade/Scale out elements sequentially)
    
    useFrame(() => {
        if (!scroll || !containerRef.current) return;
        
        const offset = scroll.offset * scroll.pages; // Absolute scroll units
        // Assuming this component sits around page 1.5 to 3.5
        
        // Simpler visibility logic for mock (The scroll offset management is tricky in R3F HTML)
        // We'll rely on global scroll offset if possible, or relative.
        // Let's assume standard CSS opacity transition driven by r3f scroll range?
        // Actually, let's just render static layout and let the parent scroll handle viewport?
        // No, user wants "captura... y que desaparezca muy importante".
        
        // Let's implement local logic if possible, or just standard CSS snap?
        // Using direct ref manipulation for performance
        
        const start = 1; 
        const end = 2.5;
        
        // This is complex to coordinate without knowing exact page index.
        // For now, let's return a static beautiful component and handle fade in parent or via CSS keyframes?
        // Better: standard React entry animation.
    });

    return (
        <div 
            ref={containerRef}
            className="w-full max-w-lg mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
            style={{ fontFamily: 'var(--font-inter)' }}
        >
            {/* Header Area */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white/70 bg-white/5 px-3 py-1 rounded-full text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    Mainnet
                </div>
                <div className="text-white font-bold text-lg tracking-wide">Human Defi</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white/20" />
            </div>

            {/* Total Balance Card */}
            <div ref={cardRef} className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6 mb-6 text-center relative group transition-all duration-500 hover:scale-[1.02]">
                <div className="text-white/60 text-sm mb-1">Balance Total</div>
                <div className="text-4xl font-bold text-white mb-2">$24,593.00</div>
                <div className="text-green-400 text-sm font-mono flex items-center justify-center gap-1">
                    <ArrowUpRight size={14} /> +$1,240.50 (5.4%)
                </div>
                
                {/* Actions Grid */}
                <div className="grid grid-cols-4 gap-2 mt-6">
                    {['Buy', 'Send', 'Recv', 'Swap'].map((action, i) => (
                        <button key={action} className="flex flex-col items-center gap-2 group/btn">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-blue-500 transition-colors">
                                {i === 0 && <CreditCard size={18} />}
                                {i === 1 && <ArrowUpRight size={18} />}
                                {i === 2 && <ArrowDownLeft size={18} />}
                                {i === 3 && <Repeat size={18} />}
                            </div>
                            <span className="text-[10px] text-white/50">{action}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Accounts List & Search */}
            <div ref={listRef} className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar cuentas..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        disabled
                    />
                </div>

                {/* Mock Accounts */}
                {[
                    { name: 'Main Vault', balance: '12.5 ETH', usd: '$22,450.00', color: 'bg-blue-500' },
                    { name: 'Trading Alpha', balance: '1.2 BTC', usd: '$42,100.00', color: 'bg-orange-500' },
                    { name: 'Yield Farm', balance: '5,000 USDC', usd: '$5,000.00', color: 'bg-green-500' }
                ].map((acc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${acc.color} flex items-center justify-center text-[10px] text-white font-bold`}>
                                {acc.name[0]}
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">{acc.name}</div>
                                <div className="text-white/40 text-xs">{acc.balance}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white text-sm font-bold">{acc.usd}</div>
                            <MoreVertical size={14} className="text-white/20 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
