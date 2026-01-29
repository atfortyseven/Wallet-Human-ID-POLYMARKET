import { useState, useEffect } from 'react';
import { useAccount, useBalance, useEnsName, usePublicClient } from 'wagmi';

export interface HumanScore {
    totalScore: number;
    rank: 'Novice' | 'Citizen' | 'Veteran' | 'Whale' | 'Titan';
    breakdown: {
        age: number;
        activity: number;
        blueChip: number;
        ens: number;
        identity: number; // Gitcoin/WorldID
    };
    isLoading: boolean;
}

export function useHumanScore() {
    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { data: balance } = useBalance({ address });
    const publicClient = usePublicClient();

    const [scoreData, setScoreData] = useState<HumanScore>({
        totalScore: 0,
        rank: 'Novice',
        breakdown: { age: 0, activity: 0, blueChip: 0, ens: 0, identity: 0 },
        isLoading: true,
    });

    useEffect(() => {
        if (!address || !publicClient) {
            setScoreData(prev => ({ ...prev, isLoading: false }));
            return;
        }

        const calculateScore = async () => {
            // 1. Fetch Real Activity Data
            const txCount = await publicClient.getTransactionCount({ address });

            // Age is hard to get without indexer (e.g. Etherscan), preserving simulation for demo
            // But we can infer "some" age if nonce is high
            const estimatedYears = txCount > 50 ? 1.5 : 0.5;

            // 2. Scoring Logic

            // Age: +10 pts per estimated year
            const ageScore = Math.floor(estimatedYears * 10);

            // Activity: +1 pt per 5 txs (Real Nonce) - Max 30
            const activityScore = Math.min(Math.floor(txCount / 5), 30);

            // Blue Chip: Hold ETH > 0.05 (Real Balance)
            const ethBalance = balance ? parseFloat(balance.formatted) : 0;
            const blueChipScore = ethBalance > 0.05 ? 20 : 0;

            // ENS Owner (Real)
            const ensScore = ensName ? 15 : 0;

            // Identity (Simulated until WorldID flow used)
            const identityScore = 15;

            const total = ageScore + activityScore + blueChipScore + ensScore + identityScore;

            // Rank Determination
            let rank: HumanScore['rank'] = 'Novice';
            if (total > 80) rank = 'Titan';
            else if (total > 60) rank = 'Whale';
            else if (total > 40) rank = 'Veteran';
            else if (total > 20) rank = 'Citizen';

            setScoreData({
                totalScore: total,
                rank,
                breakdown: {
                    age: ageScore,
                    activity: activityScore,
                    blueChip: blueChipScore,
                    ens: ensScore,
                    identity: identityScore
                },
                isLoading: false
            });
        };

        calculateScore();
    }, [address, balance, ensName, publicClient]);

    return scoreData;
}
