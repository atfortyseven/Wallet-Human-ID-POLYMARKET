"use client";

export const dynamic = 'force-dynamic';

import { useWatchlist } from "@/lib/watchlist-store";
import { NewsCard } from "@/components/crystalline/NewsCard";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const { watchlist } = useWatchlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                    <Heart size={24} fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Mis Favoritos</h1>
            </div>

            {watchlist.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl backdrop-blur-sm">
                    <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Aún no tienes favoritos</h2>
                    <p className="text-gray-400 dark:text-gray-600 mt-2">Guarda mercados importantes para seguirlos después.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlist.map((item) => (
                        <div key={item.id} className="h-[400px]">
                            <NewsCard
                                title={item.title}
                                description="Favorito guardado"
                                source={item.source || "Polymarket"}
                                url={item.url || `/market/${item.id}`}
                                image={item.image}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
