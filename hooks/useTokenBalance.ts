import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
    }
] as const;

export function useTokenBalance(tokenAddress: `0x${string}`) {
    const { address } = useAccount();

    const { data: balanceData, isLoading: balanceLoading } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        }
    });

    const { data: decimals } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
    });

    const formatted = (typeof balanceData === 'bigint' && typeof decimals === 'number')
        ? formatUnits(balanceData, decimals)
        : "0.00";

    return {
        balance: balanceData,
        formatted,
        isLoading: balanceLoading,
    };
}
