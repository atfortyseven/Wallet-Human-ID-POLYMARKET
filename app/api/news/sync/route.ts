// app/api/news/sync/route.ts
import { NextResponse } from 'next/server';
import { NewsDataService } from '@/lib/news-service';
import { generateSmartTitles } from '@/lib/ai-editor';

export async function GET() {
    try {
        // Buscar noticias relacionadas con tecnología o crypto
        const articles = await NewsDataService.fetchLatest('crypto OR technology');

        if (!articles.length) {
            return NextResponse.json({ message: "No fresh news found (or API Key missing)" }, { status: 404 });
        }

        const news = articles[0]; // La más reciente

        const context = `TITULO: ${news.title} | CONTENIDO: ${news.content.substring(0, 1000)}`; // Truncate content to avoid token limits
        const aiTitles = await generateSmartTitles(context);

        return NextResponse.json({
            article: {
                id: news.id,
                originalTitle: news.title,
                source: news.source,
                image: news.imageUrl,
                url: news.link,
                date: news.pubDate
            },
            suggestions: aiTitles,
            status: "success"
        });

    } catch (error) {
        console.error("[Sync Route Error]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
