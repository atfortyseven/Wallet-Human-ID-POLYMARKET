import React from 'react';
import { IntelFeed } from '@/components/dashboard/IntelFeed';

export default function EnterpriseDashboard({ initialData }: { initialData?: any }) {
    // Use initialData for treasury/intel if provided
    const treasury = initialData?.treasury || { tvl: 8492000, supply: "15.2M", revenue: 420100 };
    const intel = initialData?.intel || [];

    return (
        <div className="min-h-screen bg-[#080808] text-[#EAEAEA] font-sans selection:bg-white/20">

            {/* 1. MESH BACKGROUND (Sutil, como Polygon/Worldcoin) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[0%] w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full opacity-30 mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto p-8 lg:p-12">


                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* BLOQUE 1: TREASURY (Removed) */}

                    {/* BLOQUE 2: SUPPLY METRICS */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-neutral-500 text-sm font-medium mb-4">Circulating Supply</p>
                            <div className="text-3xl font-medium text-white mb-1">
                                {typeof treasury.supply === 'number' ? (treasury.supply / 1000000).toFixed(1) + 'M' : treasury.supply} <span className="text-lg text-neutral-600">HMND</span>
                            </div>
                            <div className="w-full bg-neutral-800 h-1 rounded-full mt-4 overflow-hidden">
                                <div className="bg-white h-full w-[15%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-neutral-500 font-mono uppercase">
                                <span>Unlocked (15%)</span>
                                <span>Cap 100M</span>
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE 3: GOVERNANCE POWER */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-neutral-500 text-sm font-medium mb-4">Governance Weight</p>
                            <div className="text-3xl font-medium text-white mb-1">0.00 <span className="text-lg text-neutral-600">vHMND</span></div>
                        </div>
                        <button className="w-full py-3 mt-4 border border-white/10 rounded-lg text-sm font-medium text-neutral-300 hover:bg-white/5 transition-colors">
                            Delegate Votes
                        </button>
                    </div>

                    {/* BLOQUE 4: RECENT INTEL (God-Tier Terminal) */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <IntelFeed />
                    </div>

                    {/* BLOQUE 5: YOUR IDENTITY (MOVED TO HEADER) */}
                    {/* Removed as per request to avoid duplication */}

                </div>

                {/* FOOTER DISCRETO */}
                <footer className="mt-16 border-t border-white/5 pt-8 flex justify-between items-center text-xs text-neutral-600 font-mono">
                    <div>HUMANID.FI © 2026 // SYSTEM V1.0.4</div>
                    <div className="flex gap-6">
                        <span className="hover:text-neutral-400 cursor-pointer">Manifesto</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Contracts</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Privacy</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}

// SUB-COMPONENTES PARA MANTENER LA LIMPIEZA
function DataBadge({ label, value, status }: { label: string, value: string, status: 'live' | 'success' }) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-neutral-500 font-mono tracking-wider">{label}</span>
            <div className="flex items-center gap-2">
                {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                {status === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                <span className="text-sm font-medium text-neutral-300">{value}</span>
            </div>
        </div>
    )
}

function ListItem({ category, title, time, source }: any) {
    return (
        <div className="group flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <span className="px-2 py-1 rounded text-[10px] font-mono bg-white/5 text-neutral-400 border border-white/5 uppercase tracking-wide min-w-[80px] text-center">
                    {category}
                </span>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors line-clamp-1">
                    {title}
                </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-600">
                <span>{source}</span>
                <span>{time}</span>
            </div>
        </div>
    )
}
