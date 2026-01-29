import { useMemo } from 'react';

// Mock Proposal Database
const PROPOSALS = [
    { id: 'OP-42', dao: 'Optimism', title: 'Bedrock Upgrade v2', timeLeftHours: 12, userVoted: false, urgency: 'HIGH' },
    { id: 'UNI-88', dao: 'Uniswap', title: 'Fee Switch Activation', timeLeftHours: 48, userVoted: true, urgency: 'LOW' },
    { id: 'HID-05', dao: 'HumanID', title: 'Treasury Allocation Q3', timeLeftHours: 6, userVoted: false, urgency: 'CRITICAL' },
    { id: 'AAVE-12', dao: 'Aave', title: 'Add GHO to V3 Portal', timeLeftHours: 72, userVoted: false, urgency: 'LOW' },
    { id: 'COMP-31', dao: 'Compound', title: 'Risk Parameter Updates', timeLeftHours: 2, userVoted: false, urgency: 'CRITICAL' },
    { id: 'ENS-19', dao: 'ENS', title: 'Integrate LayerZero', timeLeftHours: 20, userVoted: false, urgency: 'HIGH' }
];

export interface Proposal {
    id: string;
    dao: string;
    title: string;
    timeLeftHours: number;
    userVoted: boolean;
    urgency: string;
}

export function useGovSniper() {
    // Advanced Filtering Login
    const criticalProposals = useMemo(() => {
        return PROPOSALS
            // Filter: Ending soon (< 24h) AND User hasn't voted
            .filter(p => p.timeLeftHours < 24 && !p.userVoted)
            // Sort: Most urgent first
            .sort((a, b) => a.timeLeftHours - b.timeLeftHours);
    }, []);

    const allProposals = PROPOSALS;

    return {
        criticalProposals,
        allProposals,
        actionRequiredCount: criticalProposals.length
    };
}
