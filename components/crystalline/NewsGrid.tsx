'use client';

import { useState, useEffect } from 'react';
import { NewsCard } from './NewsCard';
import { NewsSkeleton } from './NewsSkeleton';

interface NewsItem {
    id: string;
    title: string;
    imageUrl?: string | null; // From API mapped as imageUrl in service, or image in user's logic. Let's support both
    image?: string | null;
    url: string;
    link?: string;
    time: string;
    pubDate?: string;
    source: string;
    category: string;
}

export const NewsGrid = ({ category }: { category: string }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadNews = async () => {
            setLoading(true);
            setError('');
            try {
                // Añadimos timestamp para romper caché del navegador
                const res = await fetch(`/api/news/sync?category=${encodeURIComponent(category)}&t=${Date.now()}`);

                if (!res.ok) throw new Error('Error al conectar con el servidor');

                const data = await res.json();

                if (isMounted) {
                    if (Array.isArray(data)) {
                        setNews(data);
                    } else {
                        console.error('Formato inesperado:', data);
                        setError('El servidor no devolvió una lista de noticias.');
                    }
                }
            } catch (err) {
                if (isMounted) setError('No se pudieron cargar las noticias.');
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadNews();

        return () => { isMounted = false; };
    }, [category]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i}><NewsSkeleton /></div>)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 border border-red-500/50 bg-red-900/20 rounded-lg text-red-200 text-center">
                <p className="font-bold">⚠️ {error}</p>
                <p className="text-xs mt-2 opacity-70">Revisa la consola del navegador para más detalles.</p>
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                <p>No hay noticias disponibles para "{category}" en este momento.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
            {news.map((item) => (
                <NewsCard
                    key={item.id}
                    title={item.title}
                    // Prioridad de imagen: Propiedad 'image' normalizada -> Fallback en SafeImage
                    image={(item.imageUrl || item.image) || ''}
                    url={item.url || item.link || '#'}
                    source={item.source}
                    // Aseguramos que la fecha se pase correctamente
                    timeAgo={item.time || item.pubDate || ''}
                />
            ))}
        </div>
    );
};
