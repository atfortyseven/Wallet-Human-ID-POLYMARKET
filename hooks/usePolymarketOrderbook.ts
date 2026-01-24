import { useState, useEffect } from 'react';
import axios from 'axios';

interface Order {
    price: number;
    size: number;
}

interface Orderbook {
    bids: Order[];
    asks: Order[];
}

const POLYMARKET_CLOB_API = 'https://clob.polymarket.com/book';

export function usePolymarketOrderbook(marketId: string) {
    const [orderBook, setOrderBook] = useState<Orderbook>({ bids: [], asks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!marketId) return;

        const fetchOrderbook = async () => {
            try {
                // Fetching existing orderbook
                const response = await axios.get(POLYMARKET_CLOB_API, {
                    params: { token_id: marketId }
                });

                // Polymarket API returns { bids: [{price, size}], asks: [...] }
                // Need to parse if format differs, but usually it's standard
                setOrderBook({
                    bids: response.data.bids || [],
                    asks: response.data.asks || []
                });
                setError(null);
            } catch (err) {
                console.error("Error fetching orderbook:", err);
                setError("Failed to load orderbook");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderbook();
        const interval = setInterval(fetchOrderbook, 5000); // Polling every 5s

        return () => clearInterval(interval);
    }, [marketId]);

    return { orderBook, isLoading, error };
}
