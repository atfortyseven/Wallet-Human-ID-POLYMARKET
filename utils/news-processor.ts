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

// Fallback images map by category/keyword
const FALLBACK_IMAGES: Record<string, string> = {
    'Crypto': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2000&auto=format&fit=crop',
    'Technology': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2000&auto=format&fit=crop',
    'Politics': 'https://images.unsplash.com/photo-1529101091760-61df6be5d187?q=80&w=2000&auto=format&fit=crop',
    'Economy': 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop',
    'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2000&auto=format&fit=crop',
    'World': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop',
    'Culture': 'https://images.unsplash.com/photo-1459749411177-287ce112a8bf?q=80&w=2000&auto=format&fit=crop',
    'Default': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop'
};

const getFallbackImage = (text: string, category: string): string => {
    // 1. Try mapping the explicit category
    const catKey = Object.keys(FALLBACK_IMAGES).find(k => category.toLowerCase().includes(k.toLowerCase()));
    if (catKey) return FALLBACK_IMAGES[catKey];

    // 2. Try inferring from text content
    const lowerText = text.toLowerCase();
    if (lowerText.includes('bitcoin') || lowerText.includes('crypto') || lowerText.includes('market')) return FALLBACK_IMAGES['Crypto'];
    if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('apple')) return FALLBACK_IMAGES['Technology'];
    if (lowerText.includes('election') || lowerText.includes('vote') || lowerText.includes('policy')) return FALLBACK_IMAGES['Politics'];

    // 3. Global Default
    return FALLBACK_IMAGES['Default'];
};

export const processNewsFeed = (rawArticles: any[], categoryContext: string = 'General'): ProcessedNews[] => {
    // LOCAL: Deduplicación solo para el lote actual de noticias
    const currentBatchIds = new Set<string>();

    return rawArticles
        .filter((article) => {
            // 1. Filtros de Calidad
            if (!article.title || article.title.length < 5) return false;

            // 2. Deduplicación Local
            const uniqueId = article.article_id || article.url || article.title;
            if (currentBatchIds.has(uniqueId)) return false;
            currentBatchIds.add(uniqueId);

            return true;
        })
        .map((article) => {
            let finalImage = article.image || article.image_url;

            // Force Image: If missing, assign fallback based on category/content
            if (!finalImage || finalImage.length < 5) {
                finalImage = getFallbackImage(article.title + " " + (article.description || ""), categoryContext);
            }

            return {
                id: article.article_id || article.url || Math.random().toString(),
                title: article.title,
                image: finalImage,
                url: article.url || article.link,
                source: article.source || article.source_name || "Polymarket",
                timeAgo: article.time || article.pubDate || article.publishedAt || new Date().toISOString(),
                isGradient: false // Disabled as requested
            };
        })
        .slice(0, 20); // Limit to top 20
};
