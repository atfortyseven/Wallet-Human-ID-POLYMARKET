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
        name: "getPoolBalances", // Función estándar en Gnosis FPMM
        outputs: [{ name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply", // Para estimar volumen/liquidez
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    }
] as const;

export interface MarketData {
    address: string;
    title: string;
    probability: number;
    volume: string;
    liquidity: string;
    category: string;
}

export const useMarkets = () => {
    const [markets, setMarkets] = useState<MarketData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        const fetchMarkets = async () => {
            if (!publicClient || !FACTORY_ADDRESS) {
                console.warn("Faltan configuraciones (Provider o Factory Address)");
                setIsLoading(false);
                return;
            }

            try {
                // 1. Log Scraping: Buscamos mercados creados en la blockchain
                const logs = await publicClient.getLogs({
                    address: FACTORY_ADDRESS,
                    event: parseAbiItem('event FixedProductMarketMakerCreation(address indexed creator, address fixedProductMarketMaker, address conditionalTokens, address collateralToken, bytes32[] conditionIds, uint256 fee)'),
                    fromBlock: 'earliest'
                });

                // 2. Multicall Virtual: Procesamos cada mercado en paralelo
                const marketPromises = logs.map(async (log) => {
                    const marketAddress = log.args.fixedProductMarketMaker;
                    if (!marketAddress) return null;

                    try {
                        // Leemos contrato: Pregunta, Balances y Supply
                        // Usamos multicall implícito de viem/wagmi si es posible, o llamadas directas
                        const [question, balances, totalSupply] = await Promise.all([
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'question' }).catch(() => "Mercado Sin Título"),
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'getPoolBalances' }).catch(() => [0n, 0n]),
                            publicClient.readContract({ address: marketAddress, abi: MARKET_ABI, functionName: 'totalSupply' }).catch(() => 0n),
                        ]);

                        // 3. Matemática Financiera: Calculamos la probabilidad implícita
                        // Precio = BalanceA / (BalanceA + BalanceB)
                        let probability = 50;
                        const balYes = Number(formatEther(balances[0] as bigint)); // Asumimos index 0 = YES (depende del setup, a veces es 1)
                        const balNo = Number(formatEther(balances[1] as bigint));

                        if (balYes + balNo > 0) {
                            // Invertimos la lógica si es necesario según como hayas ordenado los outcomes
                            // En Gnosis CPMM estándar: Outcome tokens se mintean en ratio.
                            // Simplificación: Probabilidad = Proporción del pool contrario (porque mas barato = mas probable? No, en CPMM: P = B / (A+B))
                            probability = (balNo / (balYes + balNo)) * 100;
                        }

                        return {
                            id: marketAddress,
                            address: marketAddress,
                            title: question as string,
                            category: "General",
                            volume: formatEther(totalSupply as bigint),
                            liquidity: (balYes + balNo).toFixed(2),
                            probability: Math.round(probability),
                            endDate: "Open",
                            participants: 0
                        };
                    } catch (err) {
                        console.error(`Error procesando mercado ${marketAddress}`, err);
                        return null;
                    }
                });

                const results = await Promise.all(marketPromises);
                // Filtramos nulos y mostramos los más recientes primero
                setMarkets(results.filter((m): m is MarketData => m !== null).reverse());

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
