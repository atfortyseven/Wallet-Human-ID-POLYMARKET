'use client';

import { useEffect, useState } from 'react';
import { Trophy, ExternalLink, TrendingUp, TrendingDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Trader } from '@/lib/leaderboard-service';

export const Leaderboard = () => {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Estado para la página actual

    // Función para cargar datos
    const loadData = (pageNum: number) => {
        setLoading(true);
        fetch(`/api/leaderboard?page=${pageNum}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTraders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // Cargar al inicio y cuando cambia la página
    useEffect(() => {
        loadData(page);
        // Scroll suave al inicio de la tabla al cambiar de página
        if (page > 1) {
            document.getElementById('leaderboard-top')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [page]);

    const handleNext = () => setPage(p => p + 1);
    const handlePrev = () => setPage(p => Math.max(1, p - 1));

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="text-yellow-400 drop-shadow-glow" size={18} />;
        if (rank === 2) return <span className="text-gray-300 font-bold text-lg">2</span>;
        if (rank === 3) return <span className="text-amber-700 font-bold text-lg">3</span>;
        return <span className="text-gray-600 font-mono text-sm">#{rank}</span>;
    };

    return (
        <div id="leaderboard-top" className="w-full bg-[#0D0D12] border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col min-h-[600px]">

            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-blue-900/5 to-transparent flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-100 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-blue-500" />
                    Top Traders Global
                </h2>
                <span className="text-xs font-mono text-gray-500">
                    Página {page}
                </span>
            </div>

            {/* Contenido */}
            <div className="flex-1">
                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center text-blue-400/50 gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs uppercase tracking-widest">Cargando Página {page}...</span>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {traders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <span className="text-sm font-medium">No hay más datos</span>
                            </div>
                        ) : (
                            traders.map((trader) => (
                                <a
                                    key={trader.address}
                                    href={trader.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                >
                                    {/* Rank */}
                                    <div className="col-span-1 flex justify-center">
                                        {getRankIcon(trader.rank)}
                                    </div>

                                    {/* Identity */}
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="relative w-8 h-8 rounded-full bg-gray-800 border border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-colors">
                                            <img src={trader.image} alt={trader.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                                {trader.name}
                                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" />
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-mono tracking-tight">
                                                {trader.address.substring(0, 6)}...
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="col-span-5 flex flex-col items-end gap-0.5">
                                        <span className="text-xs text-gray-400 font-mono">Vol: ${Math.floor(trader.volume).toLocaleString()}</span>
                                        <span className={`text-xs font-bold font-mono flex items-center gap-1 ${trader.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {trader.profit >= 0 ? '+' : ''}${Math.abs(Math.floor(trader.profit)).toLocaleString()}
                                        </span>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Controls Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-[#0a0a0e] flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={page === 1 || loading}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={14} /> ANTERIOR
                </button>

                <div className="flex gap-2">
                    {/* Indicadores visuales de página */}
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                </div>

                <button
                    onClick={handleNext}
                    disabled={loading || traders.length < 20} // Si vienen menos de 20, es la última página
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    SIGUIENTE <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};
