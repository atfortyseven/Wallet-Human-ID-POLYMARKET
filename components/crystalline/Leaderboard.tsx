'use client';

import { useEffect, useState } from 'react';
import { Trophy, ExternalLink, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { type Trader } from '@/lib/leaderboard-service';

export const Leaderboard = () => {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTraders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="text-yellow-400 drop-shadow-glow" size={18} />;
        if (rank === 2) return <span className="text-gray-300 font-bold text-lg">2</span>;
        if (rank === 3) return <span className="text-amber-700 font-bold text-lg">3</span>;
        return <span className="text-gray-600 font-mono text-sm">#{rank}</span>;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 text-blue-400/50 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-xs uppercase tracking-widest">Sincronizando On-Chain...</span>
        </div>
    );

    return (
        <div className="w-full bg-[#0D0D12] border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Header Premium */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-blue-900/5 to-transparent flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-100 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-blue-500" />
                    Top Traders
                </h2>
                <span className="text-[10px] text-green-500/80 bg-green-900/10 px-2 py-0.5 rounded border border-green-500/20 animate-pulse">
                    ● LIVE DATA
                </span>
            </div>

            {/* Lista de Traders */}
            <div className="divide-y divide-white/5">
                {traders.map((trader) => (
                    <a
                        key={trader.address}
                        href={trader.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                        {/* 1. Ranking */}
                        <div className="col-span-1 flex justify-center">
                            {getRankIcon(trader.rank)}
                        </div>

                        {/* 2. Identidad Real */}
                        <div className="col-span-6 flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full bg-gray-800 border border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-colors">
                                <img src={trader.image} alt={trader.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                    {trader.name}
                                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" />
                                </span>
                                {/* Check de Realismo Visual: Mostrar parte de la address */}
                                <span className="text-[10px] text-gray-600 font-mono tracking-tight">
                                    {trader.address.substring(0, 6)}...{trader.address.substring(38)}
                                </span>
                            </div>
                        </div>

                        {/* 3. Métricas Financieras */}
                        <div className="col-span-5 flex flex-col items-end gap-0.5">
                            <span className="text-xs text-gray-400 font-mono">Vol: ${Math.floor(trader.volume).toLocaleString()}</span>
                            <span className={`text-xs font-bold font-mono flex items-center gap-1 ${trader.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trader.profit >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {trader.profit >= 0 ? '+' : ''}${Math.abs(Math.floor(trader.profit)).toLocaleString()}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
