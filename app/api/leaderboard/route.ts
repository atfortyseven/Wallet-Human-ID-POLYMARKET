import { NextResponse } from 'next/server';
import { fetchTopTraders } from '@/lib/leaderboard-service';

export async function GET() {
    try {
        const traders = await fetchTopTraders();

        return NextResponse.json(traders, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error('[API Error] Leaderboard fetch failed:', error);
        return NextResponse.json([], { status: 500 });
    }
}
