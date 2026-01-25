
import { ExternalLink, Clock, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RelatedMarket } from './RelatedMarket';
import { useWatchlist } from '@/lib/watchlist-store';
import { toast } from 'sonner';

interface NewsCardProps {
    title: string;
    image: string;
    url: string;
    source: string;
    timeAgo: string;
    isGradient?: boolean;
    description?: string;
}

export const NewsCard = ({ title, image, url, source, timeAgo, isGradient = false, description }: NewsCardProps) => {
    const [imgError, setImgError] = useState(false);
    const { isSaved, toggleItem } = useWatchlist();
    // Hydration fix for zustand persist (optional but recommended)
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isFav = isSaved(url); // Using URL as unique ID for news

    const handleFav = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem({
            id: url,
            type: 'news',
            title: title,
            meta: image
        });
        toast(isFav ? "Eliminado de favoritos" : "Añadido a favoritos", {
            icon: isFav ? <Star size={16} /> : <Star size={16} fill="#EAB308" className="text-yellow-500" />
        });
    };

    // Formateo limpio de fecha
    const dateStr = timeAgo.includes('T')
        ? new Date(timeAgo).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : timeAgo;

    // Simple Sentiment Analysis based on title keywords
    const isBullish = title.toLowerCase().match(/surge|record|high|jump|bull|growth|approve|win/);
    const isBearish = title.toLowerCase().match(/drop|crash|low|bear|ban|lawsuit|fail|loss/);
    const sentiment = isBullish ? 'bullish' : isBearish ? 'bearish' : 'neutral';

    // Market Keyword Extraction (Main noun/topic)
    const keyword = title.split(' ').slice(0, 3).join(' '); // Taking first 3 words as a naive keyword

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col h-full bg-[#0D0D12] dark:bg-[#0D0D12] bg-white border border-black/5 dark:border-white/5 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 relative"
        >
            {/* FAVORITE BUTTON (Top Right) */}
            <button
                onClick={handleFav}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors"
            >
                {mounted && (
                    <Star
                        size={16}
                        className={`transition - colors duration - 300 ${isFav ? 'text-yellow-500 fill-yellow-500' : 'text-white/60 hover:text-white'} `}
                    />
                )}
            </button>

            {/* ZONA DE IMAGEN - Prioridad Visual Total */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-900">
                {/* Sentiment Badge - Moved to Top Left below source or adjusted positioning if conflicting */}
                {/* Let's keep sentiment Top/Right but shift it down or left? Or let the Star take priority top-right and move sentiment to top-left next to source? */}
                {/* Actually, let's keep Sentiment Top Right but lower it, or put it bottom right of image? */}
                {/* Simplified: Put Star Top Right. Put Sentiment Top Left next to Source Badge? Or Bottom Left of image? */}
                {/* Decision: Put Sentiment Bottom Right of Image. */}

                {sentiment !== 'neutral' && (
                    <div className={`absolute bottom - 3 right - 3 z - 10 px - 2 py - 1 rounded text - [10px] font - bold uppercase tracking - wider backdrop - blur - md border ${sentiment === 'bullish'
                            ? 'bg-green-500/80 text-white border-green-400/50'
                            : 'bg-red-500/80 text-white border-red-400/50'
                        } `}>
                        <div className="flex items-center gap-1">
                            {sentiment === 'bullish' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {sentiment}
                        </div>
                    </div>
                )}

                {isGradient || imgError ? (
                    // Renderizado de Arte Generativo (Gradiente Único)
                    <div
                        className="w-full h-full flex items-center justify-center p-6 text-center"
                        style={{ background: isGradient ? image : 'linear-gradient(to right, #1a1a1a, #2a2a2a)' }}
                    >
                        <span className="text-white/20 font-serif italic text-2xl font-bold tracking-widest opacity-50 mix-blend-overlay">
                            {source}
                        </span>
                    </div>
                ) : (
                    // Renderizado de Foto Real
                    <>
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                        {/* Overlay Cinemático */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 dark:opacity-80 transition-opacity" />
                    </>
                )}

                {/* Badge Flotante Minimalista */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/80 dark:text-white/90 shadow-sm">
                    {source}
                </div>
            </div>

            {/* ZONA DE CONTENIDO - Tipografía Limpia */}
            <div className="flex flex-col flex-1 p-5 relative">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-500 mb-3">
                    <Clock size={12} className="text-blue-500" />
                    <span className="uppercase tracking-wide">{dateStr}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors font-sans tracking-tight">
                    {title}
                </h3>

                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-4 font-medium">
                        {description}
                    </p>
                )}

                {/* Related Market Widget */}
                <div className="mt-auto">
                    <RelatedMarket keyword={keyword} />
                </div>

                <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-600 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-400 transition-colors">
                        Leer análisis completo
                    </span>
                    <div className="bg-black/5 dark:bg-white/5 p-1.5 rounded-full group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20 transition-colors">
                        <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    </div>
                </div>
            </div>
        </a>
    );
};
