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
    }
}
