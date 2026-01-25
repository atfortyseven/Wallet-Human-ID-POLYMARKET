import { NextResponse } from 'next/server';
import { fetchNewsByCategory } from '@/lib/news-service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'Trending';

        // Llamamos al servicio que ya arreglaste
        const news = await fetchNewsByCategory(category);

        // IMPORTANTE: Devolver headers para evitar caché viejo en el navegador
        return NextResponse.json(news, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0', // Forzamos datos frescos siempre
            },
        });
    } catch (error) {
        console.error('[API Error] Fallo en ruta de noticias:', error);
        return NextResponse.json([], { status: 500 });
    }
}
