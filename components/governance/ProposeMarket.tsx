/**
 * ProposeMarket Component
 * 
 * Sybil-resistant market proposal submission with World ID verification
 * Implements democratic market creation governance
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';
import { Vote, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

interface ProposalFormData {
    question: string;
    description: string;
    outcomes: string[];
    resolutionCriteria: string;
    category: string;
}

export function ProposeMarket() {
    const { address, isConnected } = useAccount();
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [worldIdProof, setWorldIdProof] = useState<ISuccessResult | null>(null);

    const [formData, setFormData] = useState<ProposalFormData>({
        question: '',
        description: '',
        outcomes: ['Yes', 'No'],
        resolutionCriteria: '',
        category: 'Crypto',
    });

    const handleWorldIDSuccess = (result: ISuccessResult) => {
        setWorldIdProof(result);
        setIsVerified(true);
        toast.success('World ID verified! You can now submit your proposal.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isVerified || !worldIdProof) {
            toast.error('Please verify with World ID first');
            return;
        }

        if (!address) {
            toast.error('Please connect your wallet');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/governance/propose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    creatorAddress: address,
                    worldIdProof: {
                        merkle_root: worldIdProof.merkle_root,
                        nullifier_hash: worldIdProof.nullifier_hash,
                        proof: worldIdProof.proof,
                        verification_level: worldIdProof.verification_level,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit proposal');
            }

            toast.success('Proposal submitted! Voting period has started.');

            // Reset form
            setFormData({
                question: '',
                description: '',
                outcomes: ['Yes', 'No'],
                resolutionCriteria: '',
                category: 'Crypto',
            });
            setIsVerified(false);
            setWorldIdProof(null);

        } catch (error) {
            console.error('Error submitting proposal:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit proposal');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateOutcome = (index: number, value: string) => {
        const newOutcomes = [...formData.outcomes];
        newOutcomes[index] = value;
        setFormData({ ...formData, outcomes: newOutcomes });
    };

    const addOutcome = () => {
        if (formData.outcomes.length < 10) {
            setFormData({ ...formData, outcomes: [...formData.outcomes, ''] });
        }
    };

    const removeOutcome = (index: number) => {
        if (formData.outcomes.length > 2) {
            const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
            setFormData({ ...formData, outcomes: newOutcomes });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Vote className="w-8 h-8 text-purple-500" />
                    Propose a Market
                </h1>
                <p className="text-muted-foreground">
                    Submit a market proposal for community voting. Requires World ID verification (orb level).
                </p>
            </div>

            {/* World ID Verification */}
            <div className="mb-6">
                <div className={`p-6 rounded-xl border-2 ${isVerified
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-purple-500/10 border-purple-500/30'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isVerified ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                                <Users className="w-6 h-6 text-purple-500" />
                            )}
                            <div>
                                <h3 className="font-semibold">
                                    {isVerified ? 'Verified Human' : 'Verify Your Identity'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isVerified
                                        ? 'You can now submit your proposal'
                                        : 'Prove you\'re a unique human with World ID'}
                                </p>
                            </div>
                        </div>

                        {!isVerified && (
                            <IDKitWidget
                                app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                                action="propose_market"
                                verification_level={VerificationLevel.Orb}
                                onSuccess={handleWorldIDSuccess}
                            >
                                {({ open }) => (
                                    <button
                                        onClick={open}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Verify with World ID
                                    </button>
                                )}
                            </IDKitWidget>
                        )}
                    </div>
                </div>
            </div>

            {/* Proposal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Market Question *
                    </label>
                    <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Will Bitcoin reach $100,000 by end of 2026?"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        disabled={!isVerified}
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        disabled={!isVerified}
                    >
                        <option value="Crypto">Crypto</option>
                        <option value="Politics">Politics</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Science">Science</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Description *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide context and details about this market..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        required
                        disabled={!isVerified}
                    />
                </div>

                {/* Outcomes */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Possible Outcomes *
                    </label>
                    <div className="space-y-2">
                        {formData.outcomes.map((outcome, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={outcome}
                                    onChange={(e) => updateOutcome(index, e.target.value)}
                                    placeholder={`Outcome ${index + 1}`}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                    disabled={!isVerified}
                                />
                                {formData.outcomes.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOutcome(index)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        disabled={!isVerified}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {formData.outcomes.length < 10 && (
                        <button
                            type="button"
                            onClick={addOutcome}
                            className="mt-2 text-sm text-purple-500 hover:text-purple-600 font-semibold"
                            disabled={!isVerified}
                        >
                            + Add Outcome
                        </button>
                    )}
                </div>

                {/* Resolution Criteria */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Resolution Criteria *
                    </label>
                    <textarea
                        value={formData.resolutionCriteria}
                        onChange={(e) => setFormData({ ...formData, resolutionCriteria: e.target.value })}
                        placeholder="How will this market be resolved? What sources will be used?"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        required
                        disabled={!isVerified}
                    />
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-blue-400 mb-1">Voting Requirements</p>
                            <ul className="text-muted-foreground space-y-1">
                                <li>• Minimum 100 votes required for approval</li>
                                <li>• Voting period: 7 days</li>
                                <li>• You'll earn royalties if your market is approved</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isVerified || isSubmitting || !isConnected}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting Proposal...
                        </span>
                    ) : (
                        'Submit Proposal for Voting'
                    )}
                </button>
            </form>
        </div>
    );
}
