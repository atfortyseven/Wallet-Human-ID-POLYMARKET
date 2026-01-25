"use client";

import { useEffect, useState } from "react";
import { searchMarkets, MarketData } from "@/lib/market-service";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export function RelatedMarket({ keyword }: { keyword: string }) {
    const [market, setMarket] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarket() {
            if (!keyword) return;
            setLoading(true);
            const data = await searchMarkets(keyword);
            setMarket(data);
            setLoading(false);
        }
        fetchMarket();
    }, [keyword]);

    if (loading) return (
        <div className="mt-4 h-24 w-full bg-white/5 animate-pulse rounded-xl" />
    );

    if (!market) return null;

    const yesPrice = parseFloat(market.outcomePrices[0]) * 100;
    const noPrice = parseFloat(market.outcomePrices[1]) * 100;

    return (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur-md hover:border-blue-500/40 transition-colors group/market">
            <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    <TrendingUp size={12} />
                    Mercado Relacionado
                </span>
                <a
                    href={`https://polymarket.com/event/${market.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                >
                    Trade Now <ArrowUpRight size={10} />
                </a>
            </div>

            <h4 className="text-xs font-semibold text-gray-200 leading-snug mb-3 line-clamp-2">
                {market.question}
            </h4>

            <div className="flex flex-col gap-2">
                {/* Outcome Bars */}
                <div className="relative h-6 w-full bg-black/40 rounded overflow-hidden flex text-[10px] font-bold">
                    {/* YES */}
                    <div
                        className="h-full bg-green-500/20 text-green-400 flex items-center pl-2 transition-all duration-1000"
                        style={{ width: `${yesPrice}%` }}
                    >
                        YES {yesPrice.toFixed(0)}%
                    </div>
                    {/* NO */}
                    <div
                        className="h-full bg-red-500/20 text-red-400 flex items-center justify-end pr-2 flex-1 transition-all duration-1000"
                    >
                        NO {noPrice.toFixed(0)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
