"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";
import Image from "next/image";

// Mock Data Fetcher
const fetcher = async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    // Generate 40 items
    return Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        headline: i % 2 === 0
            ? "Massive Movement: 10,000 BTC Transferred to Unknown Wallet"
            : "Polymarket Volume Hits Record $100M Amid Election Frenzy",
        description: i % 2 === 0
            ? "A colossal transaction flagged by Whale Alert suggests institutional accumulation or OTC deal preparation before the halving event."
            : "Prediction markets are outpacing traditional polls as liquidity floods into critical 'Swing State' contracts.",
        time: `${i + 2}m ago`,
        source: i % 2 === 0 ? "On-Chain Data" : "Market Analytics",
        image: i % 2 === 0
            ? "https://images.unsplash.com/photo-1518546305927-5a420f3463fb?auto=format&fit=crop&q=80&w=600"
            : "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=600"
    }));
};

export default function NewsFeed() {
    // Poll every 5 minutes (300000 ms) and on focus
    const { data: news, isLoading } = useSWR('news-feed', fetcher, {
        refreshInterval: 300000,
        revalidateOnFocus: true
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl mx-auto space-y-6 pb-20"
        >
            {isLoading && !news && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
                </div>
            )}

            {news?.map((article) => (
                <motion.div
                    key={article.id}
                    variants={item}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-lg shadow-black/20 transition-all duration-500 hover:bg-white/10 hover:border-white/30"
                >
                    {/* Gradient Background for Volume */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row h-full relative z-10">

                        {/* Image Column */}
                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 md:bg-gradient-to-l opacity-50 z-10" />
                            <Image
                                src={article.image}
                                alt="News visual"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority={article.id === 0}
                                unoptimized={true}
                            />
                        </div>

                        {/* Text Column */}
                        <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3 text-[10px] font-sans font-bold tracking-widest text-emerald-400 uppercase drop-shadow-sm">
                                <TrendingUp className="w-3 h-3" />
                                {article.source}
                            </div>

                            <h3 className="font-serif text-xl md:text-2xl text-white font-bold leading-tight mb-3 group-hover:text-indigo-200 transition-colors drop-shadow-md">
                                {article.headline}
                            </h3>

                            <p className="font-sans text-sm text-white/80 leading-relaxed mb-4 font-medium drop-shadow-sm">
                                {article.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <Clock className="w-3 h-3" />
                                    {article.time}
                                </div>
                                <span className="text-[10px] text-white/30 font-serif italic tracking-wider">
                                    Firmado por Polymarket Wallet
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
