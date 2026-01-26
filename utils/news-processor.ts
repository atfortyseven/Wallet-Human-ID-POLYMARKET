import { createHash } from 'crypto';

// GLOBAL removed

export interface ProcessedNews {
    id: string;
    title: string;
    image: string;
    url: string;
    source: string;
    timeAgo: string;
    isGradient: boolean;
}

function generateUniqueGradient(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c1 = Math.abs(hash % 360);
    const c2 = (c1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${c1}, 70%, 20%) 0%, hsl(${c2}, 90%, 15%) 100%)`;
}

export const processNewsFeed = (rawArticles: any[]): ProcessedNews[] => {
    // LOCAL: Deduplicación solo para el lote actual de noticias
    const currentBatchIds = new Set<string>();

    return rawArticles
        .filter((article) => {
            // 1. Filtros de Calidad
            if (!article.title || article.title.length < 5) return false;

            // 2. Deduplicación Local (dentro de esta categoría)
            const uniqueId = article.article_id || article.url || article.title;

            if (currentBatchIds.has(uniqueId)) return false;
            currentBatchIds.add(uniqueId);

            return true;
        })
        .map((article) => {
            let finalImage = article.image || article.image_url;
            let isGradient = false;

            // Simple check: If no image, generate gradient
            if (!finalImage) {
                finalImage = generateUniqueGradient(article.title);
                isGradient = true;
            }

            return {
                id: article.article_id || article.url || Math.random().toString(),
                title: article.title,
                image: finalImage,
                url: article.url || article.link,
                source: article.source || article.source_name || "Polymarket",
                timeAgo: article.time || article.pubDate || article.publishedAt || new Date().toISOString(),
                isGradient
            };
        })
        .slice(0, 20);
};
