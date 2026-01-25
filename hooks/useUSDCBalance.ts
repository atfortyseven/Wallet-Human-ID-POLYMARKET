import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';

// Dirección del contrato USDC en Polygon
const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

// ABI mínima para leer el balance
const USDC_ABI = [
    {
        constant: true,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export function useUSDCBalance() {
    const { address } = useAccount();
    const [balance, setBalance] = useState<string>('0.00');

    const { data, isError, isLoading } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    useEffect(() => {
        if (data) {
            // AQUÍ ESTÁ EL ARREGLO: (data as bigint)
            // Forzamos a TypeScript a tratar 'data' como un número gigante
            try {
                const formatted = parseFloat(formatUnits(data as bigint, 6)).toFixed(2);
                setBalance(formatted);
            } catch (e) {
                console.error("Error formatting balance:", e);
                setBalance('0.00');
            }
        } else {
            setBalance('0.00');
        }
    }, [data]);

    return { balance, isLoading, isError };
}
