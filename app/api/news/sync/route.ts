// app/api/news/sync/route.ts
import { NextResponse } from 'next/server';
import { NewsDataService } from '@/lib/news-service';
import { generateSmartTitles } from '@/lib/ai-editor';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'Trending';

        console.log(`[API] Fetching news for: ${category}`);

        // Fetch using the new method with a limit of 20
        const articles = await NewsDataService.fetchByCategory(category, 20);

        if (!articles.length) {
            return NextResponse.json({
                articles: [],
                message: "No articles found"
            });
        }

        const mappedArticles = articles.map(news => ({
            id: news.id,
            originalTitle: news.title,
            source: news.source,
            imageUrl: news.imageUrl, // Match NewsItem interface
            url: news.link,
            date: news.pubDate,
            description: news.description,
            category: category // Use the requested category to ensure fallback alignment
        }));

        return NextResponse.json({
            articles: mappedArticles,
            status: "success"
        });

    } catch (error) {
        console.error("[Sync Route Error]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
