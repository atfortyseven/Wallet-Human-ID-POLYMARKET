"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NEWS_DATA, Category } from "@/data/news";
import CategoryTabs from "@/components/crystalline/CategoryTabs";
import NewsCard from "@/components/crystalline/NewsCard";

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState<Category>("Trending");

    const filteredNews = useMemo(() => {
        return NEWS_DATA.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 pb-20">
            {/* Tabs */}
            <div className="sticky top-0 z-30 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 pb-2 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
                <CategoryTabs
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </div>

            {/* News Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredNews.map((article, index) => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            priority={index < 6}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Footer fallback */}
            {filteredNews.length === 0 && (
                <div className="py-20 text-center text-white/30 italic">
                    Loading content...
                </div>
            )}
        </div>
    );
}
