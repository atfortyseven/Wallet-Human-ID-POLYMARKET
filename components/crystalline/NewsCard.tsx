import React from 'react';

interface NewsCardProps {
    title: string;
    description: string;
    source: string;
    url: string;
    date?: string;
}

export default function NewsCard({ title, description, source, url, date }: NewsCardProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group h-full"
        >
            <div className="h-full p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {source}
                    </span>
                    {date && <span className="text-xs text-gray-500">{date}</span>}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3 flex-grow">
                    {description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-gray-500 group-hover:text-purple-400 transition-colors">
                    Leer noticia completa →
                </div>
            </div>
        </a>
    );
}
