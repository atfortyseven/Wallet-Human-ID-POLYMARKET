
export interface NewsArticle {
    id: string;
    title: string;
    link: string;
    description: string;
    content: string;
    pubDate: string;
    source: string;
    imageUrl: string | null;
    category: string[];
}

/**
 * NewsDataService: Clase para gestionar la comunicación con NewsData.io
 * Centraliza la lógica de filtrado y limpieza de datos.
 */
export class NewsDataService {
    private static readonly BASE_URL = "https://newsdata.io/api/1/news";
    private static readonly API_KEY = process.env.NEWSDATA_API_KEY;

    static async fetchLatest(query: string = 'actualidad'): Promise<NewsArticle[]> {
        if (!this.API_KEY) {
            console.warn("[NewsDataService] Missing NEWSDATA_API_KEY in environment variables");
            return [];
        }

        const params = new URLSearchParams({
            apikey: this.API_KEY,
            q: query,
            language: 'es',
        });

        try {
            const result = await this.fetchRaw(params);
            return result.articles;
        } catch (error) {
            console.error("[NewsService Critical Failure]:", error);
            return [];
        }
    }

    static async fetchByCategory(categoryName: string, limit: number = 20): Promise<NewsArticle[]> {
        const queryParams = this.mapCategoryToParams(categoryName);

        const params = new URLSearchParams({
            apikey: this.API_KEY || '',
            language: 'es',
        });

        if (queryParams.q) params.append('q', queryParams.q);
        if (queryParams.category) params.append('category', queryParams.category);

        // NewsData.io standard limit
        params.append('size', '10');

        let articles: NewsArticle[] = [];
        let nextPage: string | null = null;

        try {
            // First Page
            const result1 = await this.fetchRaw(params);
            articles = [...articles, ...result1.articles];
            nextPage = result1.nextPage;

            // Second Page (if we need more and have a next page)
            if (articles.length < limit && nextPage) {
                params.set('page', nextPage);
                const result2 = await this.fetchRaw(params);
                articles = [...articles, ...result2.articles];
            }

            return articles.slice(0, limit);

        } catch (error) {
            console.error(`Error fetching category ${categoryName}:`, error);
            return [];
        }
    }

    private static async fetchRaw(params: URLSearchParams): Promise<{ articles: NewsArticle[], nextPage: string | null }> {
        // Enforce images from API side if possible
        params.append('image', '1');

        const response = await fetch(`${this.BASE_URL}?${params.toString()}`, {
            next: { revalidate: 900 },
        });

        const data = await response.json();

        if (data.status !== "success") {
            console.error(`[NewsData Error]:`, data);
            return { articles: [], nextPage: null };
        }

        const rawResults = data.results as any[] || [];
        console.log(`[DEBUG] Received ${rawResults.length} articles. Item 0 keys:`, rawResults.length > 0 ? Object.keys(rawResults[0]) : "Empty");

        const articles = rawResults
            .map((article: any) => ({
                id: article.article_id,
                title: article.title,
                link: article.link || article.url,
                description: article.description || "Sin descripción disponible.",
                content: article.content || article.description || "",
                pubDate: article.pubDate,
                source: article.source_id,
                // ROBUST MAPPING: Check all common keys
                imageUrl: article.image_url || article.urlToImage || article.image || article.cover || null,
                category: article.category || [],
            }))
            // RELAXED FILTER: Keep article even if image is null (SafeImage will handle fallback)
            .filter((article: NewsArticle) => article.title && article.link);

        return { articles, nextPage: data.nextPage };
    }

    private static mapCategoryToParams(userCategory: string): { q?: string, category?: string } {
        const cat = userCategory.toLowerCase();

        switch (cat) {
            case 'trending': return { category: 'top' };
            case 'breaking': return { q: 'breaking news OR urgentes' };
            case 'new': return { category: 'top' };
            case 'politics': return { category: 'politics' };
            case 'sports': return { category: 'sports' };
            case 'crypto': return { q: 'crypto OR bitcoin OR ethereum OR blockchain' };
            case 'finance': return { category: 'business' };
            case 'geopolitics': return { q: 'geopolitics OR geopolitica OR internacional' };
            case 'earnings': return { q: 'earnings OR resultados financieros OR bolsa' };
            case 'tech': return { category: 'technology' };
            case 'culture': return { category: 'entertainment' };
            case 'world': return { category: 'world' };
            case 'economy': return { q: 'economy OR economia OR inflation' };
            case 'climate & science': return { category: 'science' };
            case 'elections': return { q: 'elections OR elecciones' };
            case 'mentions': return { q: 'polymarket' };
            default: return { category: 'top' };
        }
    }
}
