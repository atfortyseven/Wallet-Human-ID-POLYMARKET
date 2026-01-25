import axios from 'axios';

export interface MarketData {
    id: string;
    question: string;
    image: string;
    slug: string;
    outcomes: string[];
    outcomePrices: string[];
    volume: number;
}

const GAMMA_API_URL = 'https://gammap-api.polymarket.com/events';

export async function searchMarkets(keyword: string): Promise<MarketData | null> {
    try {
        // Simple keyword sanitation
        const cleanKeyword = keyword.replace(/[^\w\s]/gi, '').split(' ')[0];
        if (!cleanKeyword || cleanKeyword.length < 3) return null;

        const response = await axios.get(GAMMA_API_URL, {
            params: {
                limit: 1,
                q: cleanKeyword,
                closed: false
            }
        });

        if (!response.data || response.data.length === 0) return null;

        const event = response.data[0];
        // Find the most active market in the event (usually the first one or main)
        const market = event.markets?.[0];

        if (!market) return null;

        return {
            id: market.id,
            question: market.question,
            image: event.image,
            slug: event.slug, // used for linking
            outcomes: JSON.parse(market.outcomes),
            outcomePrices: JSON.parse(market.outcomePrices),
            volume: parseFloat(market.volume || '0')
        };

    } catch (error) {
        console.error("Error fetching market:", error);
        return null;
    }
}
