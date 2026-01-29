import { useState, useEffect } from 'react';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';
import { Vote, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAccount } from 'wagmi';
import useSWR from 'swr';

interface Proposal {
    id: string;
    question: string;
    description: string;
    outcomes: string[];
    category: string;
    creatorAddress: string;
    votes?: number;
    createdAt?: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function GovernanceProposals() {
    const { isAuthenticated } = useAuth();
    const { address } = useAccount();
    const { data: proposals, isLoading, mutate } = useSWR<Proposal[]>('/api/governance/proposals', fetcher, {
        refreshInterval: 10000 // Refresh every 10 seconds
    });

    const [votingProposal, setVotingProposal] = useState<string | null>(null);

    const handleVote = async (proposalId: string, outcomeIndex: number, proof: ISuccessResult) => {
        setVotingProposal(proposalId);

        if (!address) {
            toast.error('Conecta tu wallet primero');
            setVotingProposal(null);
            return;
        }

        try {
            // Map outcome index to FOR/AGAINST (0 = FOR, 1 = AGAINST)
            const vote = outcomeIndex === 0 ? 'FOR' : 'AGAINST';

            const res = await fetch('/api/governance/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId,
                    vote,
                    voterAddress: address,
                    worldIdProof: {
                        merkle_root: proof.merkle_root,
                        nullifier_hash: proof.nullifier_hash,
                        proof: proof.proof,
                        verification_level: proof.verification_level,
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to vote');
            }

            toast.success(`¡Voto registrado: ${vote === 'FOR' ? 'A favor' : 'En contra'}!`);
            mutate(); // Refresh proposals
        } catch (error: any) {
            console.error('Vote error:', error);
            toast.error(error.message || 'Error al votar');
        } finally {
            setVotingProposal(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    if (!proposals || proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Vote className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-sm text-zinc-500">
                    No hay encuestas activas.
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                    Haz clic en Governance para crear la primera.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                <span className="flex items-center gap-1">
                    <Vote size={12} className="inline" /> Encuestas Activas
                </span>
                <span className="text-indigo-400">{proposals.length} Encontradas</span>
            </div>

            {proposals.map((proposal) => (
                <div
                    key={proposal.id}
                    className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-indigo-500/20 p-5 rounded-2xl hover:border-indigo-500/40 transition-all"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold uppercase">
                                {proposal.category}
                            </span>
                            <h3 className="text-base font-bold text-white mt-2 mb-1">
                                {proposal.question}
                            </h3>
                            {proposal.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2">
                                    {proposal.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Voting Options */}
                    {proposal.outcomes && proposal.outcomes.length === 2 && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {proposal.outcomes.map((outcome, idx) => (
                                <IDKitWidget
                                    key={idx}
                                    app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                                    action={`vote_${proposal.id}_${outcome}`}
                                    signal={proposal.id}
                                    onSuccess={(proof) => handleVote(proposal.id, idx, proof)}
                                    verification_level={VerificationLevel.Orb}
                                >
                                    {({ open }: { open: () => void }) => (
                                        <button
                                            onClick={open}
                                            disabled={!isAuthenticated || votingProposal === proposal.id}
                                            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${idx === 0
                                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                                                : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {votingProposal === proposal.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Votando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Vote className="w-4 h-4" />
                                                    <span>{outcome}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </IDKitWidget>
                            ))}
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-zinc-500 font-mono">
                            Por: {proposal.creatorAddress?.slice(0, 6)}...{proposal.creatorAddress?.slice(-4)}
                        </span>
                        {proposal.votes !== undefined && (
                            <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                {proposal.votes} votos
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
