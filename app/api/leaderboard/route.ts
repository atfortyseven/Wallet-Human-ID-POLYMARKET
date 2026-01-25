import { NextResponse } from 'next/server';
import { fetchTopTraders } from '@/lib/leaderboard-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // Leemos la página, por defecto es 1 si no viene nada
    const page = parseInt(searchParams.get('page') || '1');

    const traders = await fetchTopTraders(page);

    return NextResponse.json(traders, {
        headers: {
            'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
    });
}
