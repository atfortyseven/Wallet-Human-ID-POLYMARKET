'use client';

import { useState, useEffect } from 'react';
import { NewsCard } from '@/components/crystalline/NewsCard'; // Importación Correcta
import { NewsSkeleton } from '@/components/crystalline/NewsSkeleton';
import { processNewsFeed, ProcessedNews } from '@/utils/news-processor';

export const NewsGrid = ({ category }: { category: string }) => {
    const [news, setNews] = useState<ProcessedNews[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchNews = async () => {
            setLoading(true);
            try {
                // Fetch a tu API interna (Cache de 1 minuto)
                const cacheBuster = Math.floor(Date.now() / 60000);
                const res = await fetch(`/api/news/sync?category=${category}&t=${cacheBuster}`);
                const rawData = await res.json();

                if (isMounted) {
                    // AQUI OCURRE LA MAGIA: Procesamos para eliminar duplicados y mejorar imágenes
                    const uniqueNews = processNewsFeed(Array.isArray(rawData) ? rawData : [], category);
                    setNews(uniqueNews);
                }
            } catch (error) {
                console.error("Error visual feed:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchNews();
        return () => { isMounted = false; };
    }, [category]);

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><NewsSkeleton /><NewsSkeleton /><NewsSkeleton /></div>;

    if (news.length === 0) return <div className="text-center py-20 text-gray-500 font-light">Sin novedades visuales en esta categoría.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 px-1 min-h-[500px]">
            {news.map((item) => (
                <NewsCard
                    key={item.id}
                    title={item.title}
                    image={item.image}
                    url={item.url}
                    source={item.source}
                    timeAgo={item.timeAgo}
                    isGradient={item.isGradient}
                />
            ))}
        </div>
    );
};
