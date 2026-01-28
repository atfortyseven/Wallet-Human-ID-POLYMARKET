'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ExternalLink, ShieldAlert, Cpu, Globe, Banknote, Search, Filter, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { refreshIntelStream } from '@/src/actions/news-stream';

// --- SUB-COMPONENTS ---

const BreakingTicker = ({ items }: { items: any[] }) => {
    if (!items.length) return null;
    return (
        <div className="w-full bg-red-900/20 border-y border-red-500/20 overflow-hidden py-1 mb-4 flex items-center">
            <div className="bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 mr-2 uppercase tracking-widest shrink-0 animate-pulse">
                LIVE WIRE
            </div>
            <div className="flex whitespace-nowrap overflow-hidden mask-ticker">
                <motion.div
                    className="flex gap-8"
                    animate={{ x: "-100%" }}
                    transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                >
                    {[...items, ...items, ...items].map((item, i) => ( // Repeat for infinite scroll effect
                        <span key={i} className="text-xs text-red-200/80 font-mono flex items-center gap-2">
                            <span className="text-red-500">●</span> {item.title.substring(0, 60)}...
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const CategoryIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'GEOPOLITICS': return <Globe size={14} className="text-blue-400" />;
        case 'TECH': return <Cpu size={14} className="text-cyan-400" />;
        case 'SECURITY': return <ShieldAlert size={14} className="text-orange-400" />;
        case 'FINANCE': default: return <Banknote size={14} className="text-emerald-400" />;
    }
};

// --- MAIN COMPONENT ---

export function IntelFeed() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    // Initial Data Load & Polling
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        setIsRefreshing(true);
        const data = await refreshIntelStream();
        if (data && data.length > 0) {
            setNews(data);
        }
        setLoading(false);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    // Safe Filter Logic
    const filteredNews = useMemo(() => {
        return news.filter(item => {
            const title = item.title || "";
            const source = item.source || "";

            const matchesCategory = filter === 'ALL' || item.category === filter;
            const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
                source.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [news, filter, search]);

    const highPriorityNews = news.filter(n => n.priority === 'HIGH');

    return (
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl relative">

            {/* 1. Terminal Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Activity className="text-blue-400" size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                            INTEL STREAM
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono">ENCRYPTED // LOW LATENCY</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={loadData}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-zinc-400'}`}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* 2. Controls & Search */}
            <div className="px-4 py-3 border-b border-white/5 flex gap-3 z-10 bg-black/20">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                    <input
                        type="text"
                        placeholder="Filter keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono placeholder:text-zinc-600"
                    />
                </div>
                <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                    {['ALL', 'FINANCE', 'TECH', 'GEOPOLITICS', 'SECURITY'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${filter === cat ? 'bg-blue-500/20 text-blue-300 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Ticker for High Priority */}
            <BreakingTicker items={highPriorityNews} />

            {/* 4. News Feed Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                {/* Matrix background effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:40px_40px] [background-position:center] opacity-20 pointer-events-none" />

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-t-2 border-cyan-500 rounded-full animate-spin-reverse"></div>
                        </div>
                        <span className="text-xs font-mono animate-pulse">ESTABLISHING UPLINK...</span>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <Filter size={32} className="opacity-20 mb-2" />
                        <p className="text-xs">No signals matching parameters.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <AnimatePresence mode='popLayout'>
                            {filteredNews.map((item, index) => (
                                <motion.div
                                    key={item.id || index}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group relative"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 p-3 rounded-xl transition-all hover:translate-x-1"
                                    >
                                        <div className="flex justify-between items-start gap-4">

                                            {/* Icon Column */}
                                            <div className={`mt-1 p-2 rounded-lg bg-black/40 border border-white/5 shrink-0 group-hover:border-white/20 transition-colors`}>
                                                <CategoryIcon type={item.category} />
                                            </div>

                                            {/* Content Column */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${item.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-white/5 text-zinc-400 border-white/10'}`}>
                                                        {item.source}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-600 font-mono">
                                                        {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <h4 className="text-sm font-medium text-zinc-200 leading-snug group-hover:text-blue-200 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                            </div>

                                            {/* Action Column */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                                <ExternalLink size={14} className="text-blue-400" />
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Footer Status */}
            <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                <span>Signal Strength: 98%</span>
                <span>Latency: 12ms</span>
            </div>
        </div>
    );
}
