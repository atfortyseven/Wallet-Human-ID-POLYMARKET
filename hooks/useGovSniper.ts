import { useMemo } from 'react';

/**
 * useGovSniper Hook
 * tactical governance module that filters DAO proposals.
 * Prioritizing those expiring in <24h where you haven't voted yet.
 */
export const useGovSniper = () => {
    // Simulated Proposal Data
    const rawProposals = [
        { id: '1', dao: 'Aave', title: 'AIP-123: Freeze V2 Pool', endsInHours: 4, voted: false, urgency: 'CRITICAL' },
        { id: '2', dao: 'Uniswap', title: 'Deploy V3 on Scroll', endsInHours: 18, voted: false, urgency: 'HIGH' },
        { id: '3', dao: 'Lido', title: 'Node Operator Onboarding', endsInHours: 48, voted: true, urgency: 'LOW' },
        { id: '4', dao: 'Compound', title: 'Risk Parameter Updates', endsInHours: 2, voted: false, urgency: 'CRITICAL' },
        { id: '5', dao: 'Arbitrum', title: 'Security Council Election', endsInHours: 120, voted: false, urgency: 'MEDIUM' },
    ];

    const sniperData = useMemo(() => {
        // Filter: Expiring < 24h AND Not Voted
        const actionable = rawProposals.filter(p => p.endsInHours < 24 && !p.voted);

        // Sort by urgency/time remaining
        actionable.sort((a, b) => a.endsInHours - b.endsInHours);

        return {
            proposals: actionable,
            count: actionable.length,
            nextExpiry: actionable.length > 0 ? actionable[0].endsInHours : null
        };
    }, []);

    return sniperData;
};
