import useSWR from 'swr';
import { useAccount } from 'wagmi';

export interface Position {
    market: string;
    avgPrice: string;
    currentPrice: string;
    betAmount: string;
    toWin: string;
    currentValue: string;
    rawCurrentValue: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePolymarketPositions() {
    const { address } = useAccount();

    // Usamos la API de Gamma (o endpoint público conocido)
    // Nota: Gamma API requiere headers específicos a veces, si falla usaremos un fallback.
    // URL común: https://gamma-api.polymarket.com/positions?user={address}
    const { data, error, isLoading } = useSWR(
        address ? `https://gamma-api.polymarket.com/positions?user=${address}` : null,
        fetcher,
        { refreshInterval: 15000 }
    );

    // Mapeo de datos (ajustar según respuesta real de API)
    // Si la API devuelve un array directo o un objeto con data.
    const rawPositions = Array.isArray(data) ? data : (data?.data || []);

    const positions: Position[] = rawPositions.map((pos: any) => {
        // Calculos aproximados si la API no los da directos
        const marketName = pos.market?.question || pos.question || "Unknown Market";
        const size = parseFloat(pos.size || "0");
        const avgPrice = parseFloat(pos.avgPrice || "0");
        const currentPrice = parseFloat(pos.market?.outcomePrices?.[pos.outcomeIndex] || "0.5"); // Fallback price

        const betAmount = size * avgPrice;
        const currentValue = size * currentPrice;
        const toWin = size; // En binarias, ganas 1 USDC por share

        return {
            market: marketName,
            avgPrice: avgPrice.toFixed(2),
            currentPrice: currentPrice.toFixed(2),
            betAmount: betAmount.toFixed(2),
            toWin: toWin.toFixed(2),
            currentValue: currentValue.toFixed(2),
            rawCurrentValue: currentValue
        };
    });

    const totalPositionsValue = positions.reduce((acc: number, curr: Position) => acc + curr.rawCurrentValue, 0);

    return {
        positions,
        totalPositionsValue,
        isLoading,
        isError: error
    };
}
