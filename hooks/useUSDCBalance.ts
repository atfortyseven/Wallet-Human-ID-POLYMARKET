import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { polygon } from 'wagmi/chains';

const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const USDC_ABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
] as const;

export function useUSDCBalance() {
    const { address } = useAccount();

    const { data, isError, isLoading } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: polygon.id,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        }
    });

    const balance = data ? parseFloat(formatUnits(data, 6)).toFixed(2) : '0.00';

    return { balance, isLoading, isError };
}
