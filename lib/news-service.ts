// lib/news-service.ts

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
            // Warning instead of error to prevent crashing if key is missing during dev
            console.warn("[NewsDataService] Missing NEWSDATA_API_KEY in environment variables");
            return [];
        }

        // Configuración Premium: Idioma español, con imágenes y de la última hora
        const params = new URLSearchParams({
            apikey: this.API_KEY,
            q: query,
            language: 'es',
            // timeframe: '1', // Commented out for dev stability as this endpoint might return 0 results if query is narrow
            // prioritydomain: 'top', // Commented out to ensure results during testing
        });

        try {
            const response = await fetch(`${this.BASE_URL}?${params.toString()}`, {
                next: { revalidate: 300 }, // Cache inteligente de 5 minutos
            });

            const data = await response.json();

            if (data.status !== "success") {
                console.error(`[NewsData Error]: ${data.results?.message || data.message || 'Unknown error'}`);
                return [];
            }

            if (!data.results) return [];

            // Mapeo a nuestra interfaz limpia (Data Cleaning)
            return (data.results as any[]).map((article) => ({
                id: article.article_id,
                title: article.title,
                link: article.link,
                description: article.description || "Sin descripción disponible.",
                content: article.content || article.description || "",
                pubDate: article.pubDate,
                source: article.source_id,
                imageUrl: article.image_url || null,
                category: article.category || [],
            }));

        } catch (error) {
            console.error("[NewsService Critical Failure]:", error);
            return [];
        }
    static async fetchByCategory(categoryName: string, limit: number = 20): Promise<NewsArticle[]> {
        const queryParams = this.mapCategoryToParams(categoryName);

        // Construct query parameters
        const params = new URLSearchParams({
            apikey: this.API_KEY || '',
            language: 'es',
            // image: '1', // Ensure images if possible (API specific, sometimes 'has_image')
        });

        if (queryParams.q) params.append('q', queryParams.q);
        if (queryParams.category) params.append('category', queryParams.category);
        // Note: NewsData.io free plan might not support 'size' > 10. We request what we can.
        // We might need to make 2 requests if limit > 10 and API strict limit is 10.
        // For now, let's try requesting the size (API usually allows up to 50 on some plans).
        params.append('size', '10'); // Safe default, loop if needed for 20? 
        // Providing 20 items might require pagination 'page' param if limit is 10.
        // Let's implement a loop to fetch 2 pages if needed.

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
            return []; // Fail gracefully
        }
    }

    private static async fetchRaw(params: URLSearchParams): Promise<{ articles: NewsArticle[], nextPage: string | null }> {
        const response = await fetch(`${this.BASE_URL}?${params.toString()}`, {
            next: { revalidate: 900 }, // Cache for 15 mins
        });

        const data = await response.json();

        if (data.status !== "success") {
            console.error(`[NewsData Error]:`, data);
            return { articles: [], nextPage: null };
        }

        const articles = (data.results as any[] || []).map((article: any) => ({
            id: article.article_id,
            title: article.title,
            link: article.link,
            description: article.description || "Sin descripción disponible.",
            content: article.content || article.description || "",
            pubDate: article.pubDate,
            source: article.source_id,
            imageUrl: article.image_url || null,
            category: article.category || [],
        }));

        return { articles, nextPage: data.nextPage };
    }

    private static mapCategoryToParams(userCategory: string): { q?: string, category?: string } {
        const cat = userCategory.toLowerCase();

        // Direct Mapping based on User Request
        switch (cat) {
            case 'trending': return { category: 'top' };
            case 'breaking': return { q: 'breaking news OR urgentes' }; // Custom query
            case 'new': return { category: 'top' }; // Similar to trending
            case 'politics': return { category: 'politics' };
            case 'sports': return { category: 'sports' };
            case 'crypto': return { q: 'crypto OR bitcoin OR ethereum OR blockchain' }; // Category 'technology' might be too broad
            case 'finance': return { category: 'business' }; // 'finance' not always a direct cat
            case 'geopolitics': return { q: 'geopolitics OR geopolitica OR internacional' };
            case 'earnings': return { q: 'earnings OR resultados financieros OR bolsa' };
            case 'tech': return { category: 'technology' };
            case 'culture': return { category: 'entertainment' }; // closest? or 'lifestyle' (which is actually 'other' sometimes)
            case 'world': return { category: 'world' };
            case 'economy': return { q: 'economy OR economia OR inflation' };
            case 'climate & science': return { category: 'science' }; // + environment? 
            case 'elections': return { q: 'elections OR elecciones' };
            case 'mentions': return { q: 'polymarket' }; // Self-reference?
            default: return { category: 'top' };
        }
    }
}
