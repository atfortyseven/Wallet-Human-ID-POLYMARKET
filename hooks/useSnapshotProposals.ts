import useSWR from 'swr';
import { getProposals, Proposal } from '@/services/snapshot';

export function useSnapshotProposals(spaceId: string = 'humanid.eth') { // Default space, can be changed
    const { data, error, isLoading } = useSWR<Proposal[]>(
        ['snapshot', spaceId],
        () => getProposals(spaceId),
        {
            refreshInterval: 60000, // Refresh every minute
            revalidateOnFocus: false,
        }
    );

    return {
        proposals: data || [],
        isLoading,
        isError: error
    };
}
