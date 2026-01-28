import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem, formatEther } from 'viem';

// Validamos que la dirección exista
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FPMM_FACTORY_ADDRESS as `0x${string}`;

// ABI Extendido para leer Balances y Título
const MARKET_ABI = [
    {
        inputs: [],
        name: "question",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPoolBalances",
        outputs: [{ name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    }
] as const;

// CORRECCIÓN: Interfaz completa con todas las propiedades que usamos en el UI
export interface MarketData {
    id: string;
    address: string;
    title: string;
    category: string;
    probability: number;
    volume: string;
    liquidity: string;
    endDate: string;
    participants: number;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const useMarkets = () => {
    const [markets, setMarkets] = useState<MarketData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        const fetchMarkets = async () => {
            // Si no hay cliente o dirección, paramos
            if (!publicClient || !FACTORY_ADDRESS) {
                setIsLoading(false);
                return;
            }

            try {
                // 1. Log Scraping
                const logs = await publicClient.getLogs({
                    address: FACTORY_ADDRESS,
                    event: parseAbiItem('event FixedProductMarketMakerCreation(address indexed creator, address fixedProductMarketMaker, address conditionalTokens, address collateralToken, bytes32[] conditionIds, uint256 fee)'),
                    fromBlock: 'earliest'
                });

                // 2a. Fetch Risk Metadata from our API
                let riskMap: Record<string, string> = {};
                try {
                    const res = await fetch('/api/markets');
                    if (res.ok) {
                        const data = await res.json();
                        data.forEach((m: any) => {
                            riskMap[m.slug.toLowerCase()] = m.riskLevel;
                        });
                    }
                } catch (e) {
                    console.warn("Failed to fetch risk metadata", e);
                }

                // 2b. Multicall Virtual
                const marketPromises = logs.map(async (log) => {
                    const marketAddress = log.args.fixedProductMarketMaker;
                    if (!marketAddress) return null;

                    try {
                        const [question, balances, totalSupply] = await Promise.all([
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'question' }).catch(() => "Mercado Sin Título"),
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'getPoolBalances' }).catch(() => [0n, 0n]),
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'totalSupply' }).catch(() => 0n),
                        ]);

                        // 3. Matemática Financiera
                        let probability = 50;
                        const balYes = Number(formatEther(balances[0] as bigint));
                        const balNo = Number(formatEther(balances[1] as bigint));

                        if (balYes + balNo > 0) {
                            probability = (balNo / (balYes + balNo)) * 100;
                        }

                        // Retornamos el objeto que coincide EXACTAMENTE con la interfaz MarketData
                        const marketObj: MarketData = {
                            id: marketAddress,
                            address: marketAddress,
                            title: question as string,
                            category: "General",
                            volume: formatEther(totalSupply as bigint),
                            liquidity: (balYes + balNo).toFixed(2),
                            probability: Math.round(probability),
                            endDate: "Open",
                            participants: 0,
                            riskLevel: (riskMap[marketAddress.toLowerCase()] as any) || 'LOW'
                        };

                        return marketObj;

                    } catch (err) {
                        console.error(`Error procesando mercado ${marketAddress}`, err);
                        return null;
                    }
                });

                const results = await Promise.all(marketPromises);

                // CORRECCIÓN: Filtrado explícito para satisfacer al compilador de TS
                const validMarkets = results.filter((m): m is MarketData => m !== null);

                // Invertimos para mostrar los nuevos primero
                setMarkets(validMarkets.reverse());

            } catch (error) {
                console.error("Error crítico fetching markets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarkets();
    }, [publicClient]);

    return { markets, isLoading };
};
