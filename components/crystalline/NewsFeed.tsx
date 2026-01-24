"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

// Mock Data Fetcher
const fetcher = async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    return [
        {
            id: 1,
            headline: "Massive Movement: 10,000 BTC Transferred to Unknown Wallet",
            description: "A colossal transaction flagged by Whale Alert suggests institutional accumulation or OTC deal preparation before the halving event.",
            time: "2m ago",
            source: "On-Chain Data",
            image: "https://images.unsplash.com/photo-1518546305927-5a420f3463fb?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 2,
            headline: "Polymarket Volume Hits Record $100M Amid Election Frenzy",
            description: "Prediction markets are outpacing traditional polls as liquidity floods into critical 'Swing State' contracts.",
            time: "15m ago",
            source: "Market Analytics",
            image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 3,
            headline: "Ethereum Layer 2 TVL Surpasses $45 Billion",
            description: "Arbitrum and Optimism lead the charge as user adoption shifts definitively to scalable execution layers.",
            time: "1h ago",
            source: "DeFi Llama",
            image: "https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?auto=format&fit=crop&q=80&w=600"
        }
    ];
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
                    className="group relative overflow-hidden rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-md hover:bg-white/5 transition-colors duration-500"
                >
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Image Column */}
                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0c] md:bg-gradient-to-l opacity-50 z-10" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={article.image}
                                alt="News visual"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Text Column */}
                        <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3 text-[10px] font-sans font-bold tracking-widest text-emerald-400 uppercase">
                                <TrendingUp className="w-3 h-3" />
                                {article.source}
                            </div>

                            <h3 className="font-serif text-xl md:text-2xl text-white font-bold leading-tight mb-3 group-hover:text-indigo-200 transition-colors">
                                {article.headline}
                            </h3>

                            <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
                                {article.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-white/30">
                                <Clock className="w-3 h-3" />
                                {article.time}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
