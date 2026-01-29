import { NextResponse } from 'next/server';
import { getDashboardData } from '@/src/actions/dashboard.actions';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getDashboardData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
