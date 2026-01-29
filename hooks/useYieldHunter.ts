import { useMemo } from 'react';

/**
 * useYieldHunter Hook
 * specific ROI calculator that scores DeFi pools.
 * Based on TVL, APY, and Risk, assigning "SAFE" or "DEGEN" badges.
 */
export const useYieldHunter = () => {
    // Simulated Pool Data
    const rawPools = [
        { protocol: 'Curve', pool: '3pool', apy: 3.5, tvl: '400M', riskScore: 1, type: 'STABLE' },
        { protocol: 'GMX', pool: 'GLP', apy: 18.2, tvl: '150M', riskScore: 4, type: 'BLUECHIP' },
        { protocol: 'Pendle', pool: 'stETH Mar 25', apy: 12.5, tvl: '85M', riskScore: 3, type: 'YIELD' },
        { protocol: 'PepeSwap', pool: 'PEPE/ETH', apy: 420.69, tvl: '2M', riskScore: 10, type: 'DEGEN' },
        { protocol: 'Aave', pool: 'USDC', apy: 4.8, tvl: '1.2B', riskScore: 1, type: 'SAFE' },
    ];

    const yieldData = useMemo(() => {
        return rawPools.map(pool => {
            let badge: 'SAFE' | 'MODERATE' | 'RISKY' | 'DEGEN' = 'SAFE';

            if (pool.riskScore >= 8) badge = 'DEGEN';
            else if (pool.riskScore >= 5) badge = 'RISKY';
            else if (pool.riskScore >= 3) badge = 'MODERATE';

            return {
                ...pool,
                badge
            };
        }).sort((a, b) => b.apy - a.apy); // Sort by APY
    }, []);

    return {
        pools: yieldData,
        topPick: yieldData[0]
    };
};
