
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
            throw new Error(`Failed to fetch geo data: ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Geo API Error:', error);
        // Fallback to avoid breaking the UI completely
        return NextResponse.json({ country_code: 'XX', error: 'Failed to fetch' }, { status: 200 });
    }
}
