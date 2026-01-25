import { useQuery } from '@tanstack/react-query';
import { getTopMarkets, Market } from '@/lib/polymarket';

export function usePolymarketData() {
    const { data: markets, isLoading, error } = useQuery<Market[]>({
        queryKey: ['polymarket-top'],
        queryFn: () => getTopMarkets(6),
        refetchInterval: 30000, // Refresh every 30s
    });

    return {
        markets,
        isLoading,
        error
    };
}
