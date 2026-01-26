import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import axios from 'axios';

const DATA_API = 'https://data-api.polymarket.com';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress || !isAddress(userAddress)) {
        return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${DATA_API}/trades`, {
            params: { user: userAddress, limit: '10' }
        });

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Polymarket API Error (History):', error);
        return NextResponse.json(
            { error: 'Failed to fetch history from Polymarket' },
            { status: 500 }
        );
    }
}
