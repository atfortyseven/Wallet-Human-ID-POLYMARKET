import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import axios from 'axios';

const DATA_API = 'https://data-api.polymarket.com';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    // 1. Validación Estricta
    if (!userAddress || !isAddress(userAddress)) {
        return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    try {
        // 2. Llamada a Polymarket
        // Nota: 'limit' a 20 como solicitado, podría ser dinámico
        const response = await axios.get(`${DATA_API}/positions`, {
            params: { user: userAddress, limit: '20' }
        });

        // 3. Respuesta con Caché (SWR: Stale-While-Revalidate)
        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Polymarket API Error (Positions):', error);
        return NextResponse.json(
            { error: 'Failed to fetch positions from Polymarket' },
            { status: 500 }
        );
    }
}
