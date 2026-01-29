import VoidShell from '@/components/VoidShell';
export const dynamic = 'force-dynamic';
import VotingHub from '@/components/governance/VotingHub';

export default function VotingPage() {
    return (
        <VoidShell>
            <VotingHub />
        </VoidShell>
    );
}
