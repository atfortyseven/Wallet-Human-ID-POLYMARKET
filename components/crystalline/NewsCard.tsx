import { ExternalLink, Clock } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface NewsCardProps {
    title: string;
    image: string;
    url: string;
    source: string;
    timeAgo: string; // Recibe la fecha ISO o texto
}

export const NewsCard = ({ title, image, url, source, timeAgo }: NewsCardProps) => {
    // Función auxiliar para formatear fecha si viene en formato ISO
    const displayDate = timeAgo && timeAgo.includes('T')
        ? new Date(timeAgo).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : timeAgo || "Recently";

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 h-full"
        >
            <div className="relative w-full aspect-[16/9]">
                <SafeImage
                    src={image}
                    alt={title}
                    fallbackCategory={source} // Usamos la fuente como pista, o podríamos pasar la categoría si la tuviéramos
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 shadow-sm">
                    {source}
                </div>
            </div>

            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5">
                    <Clock size={12} className="text-blue-400" />
                    <span>{displayDate}</span>
                </div>

                <h3 className="text-sm font-medium text-gray-100 leading-snug mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                <div className="mt-auto pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-300">
                    <span>Leer artículo</span>
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </a>
    );
};
