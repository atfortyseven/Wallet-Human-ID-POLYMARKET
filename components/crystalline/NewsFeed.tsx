"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, NewsItem } from "@/data/news"; // Ensure this matches user's types
import CategoryTabs, { CATEGORIES } from "@/components/crystalline/CategoryTabs";
import NewsCard from "@/components/crystalline/NewsCard";
import { toast } from "sonner";

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState<Category>("Trending");

    // Cache: Store loaded news by category to avoid refetching
    const [newsCache, setNewsCache] = useState<Record<string, NewsItem[]>>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load (Trending)
    useEffect(() => {
        loadCategory("Trending");
    }, []);

    // Load category data (from cache or API)
    const loadCategory = useCallback(async (category: Category) => {
        // If already cached, don't fetch (unless we want to force refresh? For now, standard lazy loading)
        // Check if key exists (even if empty array, it means we tried)
        if (newsCache[category]) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching news for: ${category}`);
            // Call our own API route which proxies to NewsData
            const response = await fetch(`/api/news/sync?category=${encodeURIComponent(category)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }

            const data = await response.json();

            if (data.articles) {
                setNewsCache(prev => ({
                    ...prev,
                    [category]: data.articles
                }));
            } else {
                setNewsCache(prev => ({
                    ...prev,
                    [category]: []
                }));
            }

        } catch (err) {
            console.error("News Fetch Error:", err);
            setError("No se pudieron cargar las noticias.");
            toast.error("Error cargando noticias");
        } finally {
            setLoading(false);
        }
    }, [newsCache]);

    // Handle Tab Selection
    const handleCategorySelect = (cat: Category) => {
        setActiveCategory(cat);
        loadCategory(cat);
    };

    // Get Data for render
    const currentNews = newsCache[activeCategory] || [];
    // Show loading only if we have NO data for this category yet
    const isCategoryLoading = loading && !newsCache[activeCategory];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 pb-32 px-2 md:px-0">
            {/* Tabs */}
            <div className="sticky top-16 md:top-20 z-30 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 pb-2 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
                <CategoryTabs
                    activeCategory={activeCategory}
                    onSelect={handleCategorySelect}
                />
            </div>

            {/* ERROR MSG */}
            {error && !currentNews.length && (
                <div className="p-4 mb-4 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg text-center text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* News Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
            >
                <AnimatePresence mode="popLayout">
                    {isCategoryLoading ? (
                        // Skeleton Loading State
                        [1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                        ))
                    ) : (
                        currentNews.map((article, index) => (
                            <NewsCard
                                key={`${article.id}-${index}`} // Composite key to avoid dups if any
                                article={article}
                                priority={index < 6}
                            />
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {!isCategoryLoading && currentNews.length === 0 && (
                <div className="py-20 text-center text-white/30 italic">
                    {error ? "Intenta recargar la página." : "No se encontraron noticias para esta categoría."}
                </div>
            )}
        </div>
    );
}
