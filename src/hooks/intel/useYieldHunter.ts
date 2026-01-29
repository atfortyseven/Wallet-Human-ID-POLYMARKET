import { useMemo } from 'react';

// Mock Yield Pools
const POOLS = [
    { id: '1', name: 'USDC-ETH', protocol: 'Uniswap V3', baseApy: 15, tvl: 150000000, risk: 'MEDIUM' },
    { id: '2', name: 'WLD Staking', protocol: 'HumanID Vault', baseApy: 45, tvl: 2500000, risk: 'HIGH' },
    { id: '3', name: 'DAI Savings', protocol: 'Spark', baseApy: 8, tvl: 500000000, risk: 'LOW' },
    { id: '4', name: 'GLP', protocol: 'GMX', baseApy: 22, tvl: 80000000, risk: 'MEDIUM' },
    { id: '5', name: 'Curve 3Pool', protocol: 'Curve', baseApy: 4, tvl: 800000000, risk: 'LOW' },
    { id: '6', name: 'PEPE-ETH', protocol: 'SushiSwap', baseApy: 250, tvl: 500000, risk: 'EXTREME' }
];

export interface YieldOpportunity {
    id: string;
    name: string;
    protocol: string;
    baseApy: number;
    tvl: number;
    risk: string;
    safetyScore: number;
    riskAdjustedApy: number;
    badge: 'SAFE' | 'DEGEN' | 'BALANCED';
}

export function useYieldHunter() {

    const opportunities = useMemo(() => {
        return POOLS.map(pool => {
            // Calculate Safety Score (0-10)
            let score = 5;

            // TVL Factor
            if (pool.tvl > 100000000) score += 3;
            else if (pool.tvl > 10000000) score += 1;
            else if (pool.tvl < 1000000) score -= 2;

            // Risk Penalties
            if (pool.risk === 'LOW') score += 2;
            if (pool.risk === 'HIGH') score -= 2;
            if (pool.risk === 'EXTREME') score -= 4;

            // Clamp
            score = Math.max(0, Math.min(10, score));

            // Risk Adjusted APY (Simple Sharpe-like heuristic)
            // If safety is low, we discount the utility of the APY
            const riskFactor = score / 10;
            const adjustedApy = pool.baseApy * riskFactor;

            let badge: 'SAFE' | 'DEGEN' | 'BALANCED' = 'BALANCED';
            if (score >= 8) badge = 'SAFE';
            if (score <= 3) badge = 'DEGEN';

            return {
                ...pool,
                safetyScore: score,
                riskAdjustedApy: parseFloat(adjustedApy.toFixed(2)),
                badge
            };
        }).sort((a, b) => b.riskAdjustedApy - a.riskAdjustedApy) // Sort by best opportunity
            .slice(0, 5); // Take top 5

    }, []);

    return {
        opportunities
    };
}
