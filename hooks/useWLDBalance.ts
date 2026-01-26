/**
 * useWLDBalance Hook
 * 
 * Detects WLD balance on Optimism and calculates "risk capital" available
 * Implements the "House Money Effect" psychology
 */

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { optimism } from 'wagmi/chains';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';

// WLD Token on Optimism
const WLD_TOKEN_ADDRESS = '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1' as const;

// WLD Token ABI (minimal for balance check)
const WLD_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

interface WLDBalanceData {
    balance: bigint;
    balanceFormatted: string;
    balanceUSD: number;
    hasRiskCapital: boolean;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Fetch WLD price from CoinGecko
 */
async function fetchWLDPrice(): Promise<number> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd'
        );
        const data = await response.json();
        return data['worldcoin-wld']?.usd || 2.5; // Fallback to $2.50
    } catch (error) {
        console.error('Error fetching WLD price:', error);
        return 2.5; // Fallback price
    }
}

/**
 * Hook to get WLD balance and calculate risk capital
 * 
 * @param minThreshold - Minimum USD value to show "risk capital" banner (default: $10)
 * @returns WLD balance data and risk capital status
 */
export function useWLDBalance(minThreshold: number = 10): WLDBalanceData {
    const { address, isConnected } = useAccount();

    // Get WLD balance
    const { data: balance, isLoading: isBalanceLoading, error: balanceError } = useReadContract({
        address: WLD_TOKEN_ADDRESS,
        abi: WLD_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: optimism.id,
        query: {
            enabled: !!address && isConnected,
            refetchInterval: 30000, // Refresh every 30 seconds
        },
    });

    // Get WLD price in USD
    const { data: wldPrice, isLoading: isPriceLoading } = useQuery({
        queryKey: ['wld-price'],
        queryFn: fetchWLDPrice,
        staleTime: 60000, // Cache for 1 minute
        refetchInterval: 60000, // Refresh every minute
    });

    // Calculate values
    const balanceFormatted = balance ? formatUnits(balance, 18) : '0';
    const balanceUSD = balance && wldPrice
        ? parseFloat(formatUnits(balance, 18)) * wldPrice
        : 0;
    const hasRiskCapital = balanceUSD >= minThreshold;

    return {
        balance: balance || 0n,
        balanceFormatted,
        balanceUSD,
        hasRiskCapital,
        isLoading: isBalanceLoading || isPriceLoading,
        error: balanceError as Error | null,
    };
}

/**
 * Hook to check if user has received WLD grants recently
 * This helps identify "house money" vs earned income
 */
export function useWLDGrantStatus() {
    const { address } = useAccount();

    return useQuery({
        queryKey: ['wld-grants', address],
        queryFn: async () => {
            if (!address) return null;

            // Query World ID grant history
            // This would integrate with World ID API to check grant timestamps
            // For now, return mock data
            return {
                hasReceivedGrants: true,
                lastGrantDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                totalGrantsReceived: 3,
                isRecentGrant: true, // Within last 30 days
            };
        },
        enabled: !!address,
        staleTime: 300000, // Cache for 5 minutes
    });
}

/**
 * Hook to estimate zap output
 * Shows user how many shares they can get with their WLD
 */
export function useZapEstimate(wldAmount: bigint, marketId?: string) {
    const { data: wldPrice } = useQuery({
        queryKey: ['wld-price'],
        queryFn: fetchWLDPrice,
        staleTime: 60000,
    });

    return useQuery({
        queryKey: ['zap-estimate', wldAmount.toString(), marketId],
        queryFn: async () => {
            if (!wldPrice || wldAmount === 0n) {
                return {
                    estimatedUSDC: 0,
                    estimatedShares: 0,
                    estimatedSlippage: 0,
                    protocolFee: 0,
                };
            }

            const wldAmountFloat = parseFloat(formatUnits(wldAmount, 18));
            const estimatedUSDC = wldAmountFloat * wldPrice;

            // Estimate slippage (1% for typical swap)
            const slippage = 0.01;
            const usdcAfterSlippage = estimatedUSDC * (1 - slippage);

            // Protocol fee (0.5%)
            const protocolFee = usdcAfterSlippage * 0.005;
            const usdcForBet = usdcAfterSlippage - protocolFee;

            // Simplified: 1 USDC ≈ 1 share (actual depends on market odds)
            // In production, query Polymarket API for actual odds
            const estimatedShares = usdcForBet;

            return {
                estimatedUSDC: usdcAfterSlippage,
                estimatedShares,
                estimatedSlippage: slippage * 100, // Convert to percentage
                protocolFee,
            };
        },
        enabled: wldAmount > 0n,
        staleTime: 30000,
    });
}
