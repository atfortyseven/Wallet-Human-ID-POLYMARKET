'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshotProposals } from '@/hooks/useSnapshotProposals';
import { Loader2, ExternalLink, Vote, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { toast } from 'sonner';

// Status Badge Component
const StatusBadge = ({ state, end }: { state: string, end: number }) => {
    const isClosed = state === 'closed';
    const isActive = state === 'active';
    const timeLeft = end * 1000 - Date.now();
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    if (isActive) {
        return (
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active {daysLeft > 0 ? `• ${daysLeft}d left` : ''}
            </div>
        );
    }
    return (
        <div className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-bold uppercase">
            Closed
        </div>
    );
};

export default function VotingHub() {
    const { proposals, isLoading, isError } = useSnapshotProposals('humanid.eth'); // Using humanid.eth as requested/default
    const { isConnected } = useAppKitAccount();
    const { open } = useAppKit();
    const [selectedProposal, setSelectedProposal] = useState<any | null>(null);

    const handleVoteClick = (proposal: any) => {
        if (!isConnected) {
            toast.error("Please connect your wallet to vote");
            open();
            return;
        }
        setSelectedProposal(proposal);
    };

    const submitVote = (choiceIndex: number) => {
        // Mock Vote Submission
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Signing vote...',
                success: () => {
                    setSelectedProposal(null);
                    return 'Vote submitted successfully! (Mock)';
                },
                error: 'Failed to submit vote'
            }
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Voting Hub</h1>
                <p className="text-[var(--text-secondary)]">Participate in governance proposals via Snapshot.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                </div>
            ) : isError ? (
                <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-500 mb-2">Failed to load proposals</h3>
                    <p className="text-[var(--text-secondary)]">Could not connect to Snapshot Hub.</p>
                </div>
            ) : proposals.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] text-center">
                    <div className="w-16 h-16 bg-[var(--bg-surface)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Vote className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Active Proposals</h3>
                    <p className="text-[var(--text-secondary)]">There are no proposals currently active in this space.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proposals.map((prop) => (
                        <motion.div
                            key={prop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-main)] hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col group transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <StatusBadge state={prop.state} end={prop.end} />
                                <a
                                    href={`https://snapshot.org/#/humanid.eth/proposal/${prop.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>

                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 h-14">
                                {prop.title}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-3 flex-1">
                                {prop.body}
                            </p>

                            <div className="pt-4 mt-auto border-t border-[var(--border-main)] flex gap-3">
                                <button
                                    onClick={() => handleVoteClick(prop)}
                                    disabled={prop.state !== 'active'}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                                        ${prop.state === 'active'
                                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed'}`}
                                >
                                    <Vote size={16} />
                                    {prop.state === 'active' ? 'Vote Now' : 'Closed'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Vote Modal */}
            <AnimatePresence>
                {selectedProposal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedProposal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glass Reflection - subtle white or black gradient */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <button
                                onClick={() => setSelectedProposal(null)}
                                className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <XCircle size={24} />
                            </button>

                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 pr-8">{selectedProposal.title}</h3>
                            <div className="text-xs text-[var(--text-secondary)] mb-6 font-mono">ID: {selectedProposal.id.slice(0, 8)}...</div>

                            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                                {selectedProposal.choices.map((choice: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => submitVote(idx + 1)}
                                        className="w-full text-left p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-indigo-500/50 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[var(--text-primary)] font-medium transition-colors">{choice}</span>
                                            <CheckCircle className="w-5 h-5 text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
