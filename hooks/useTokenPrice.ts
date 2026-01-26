import { useState, useEffect } from 'react';
import useSWR from 'swr';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTokenPrice() {
    const { data, error, isLoading } = useSWR(COINGECKO_API_URL, fetcher, {
        refreshInterval: 60000, // Refresh every minute
        dedupingInterval: 60000,
    });

    return {
        price: data ? data['worldcoin-wld'].usd : 0,
        isLoading,
        error,
    };
}
