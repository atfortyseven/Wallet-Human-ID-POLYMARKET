/**
 * ClaimRewards Component
 * 
 * Dashboard for claiming accumulated royalties via Merkle proofs
 * Implements pull-based reward distribution for gas efficiency
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { formatUnits } from 'viem';

interface MerkleDistribution {
    id: string;
    merkleRoot: string;
    periodStart: Date;
    periodEnd: Date;
    totalAmount: number;
    status: string;
}

interface ClaimableReward {
    distributionId: string;
    amount: number;
    merkleProof: string[];
    periodEnd: Date;
}

export function ClaimRewards() {
    const { address, isConnected } = useAccount();
    const [claimableRewards, setClaimableRewards] = useState<ClaimableReward[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [selectedReward, setSelectedReward] = useState<ClaimableReward | null>(null);

    const { writeContract, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Fetch claimable rewards
    useEffect(() => {
        if (!address) return;

        const fetchRewards = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/royalties/claimable?address=${address}`);
                const data = await response.json();

                if (response.ok) {
                    setClaimableRewards(data.rewards || []);
                }
            } catch (error) {
                console.error('Error fetching rewards:', error);
                toast.error('Failed to load claimable rewards');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRewards();
    }, [address]);

    // Handle successful claim
    useEffect(() => {
        if (isSuccess && selectedReward) {
            toast.success(`Successfully claimed $${selectedReward.amount.toFixed(2)}!`);
            // Refresh rewards list
            setClaimableRewards(prev =>
                prev.filter(r => r.distributionId !== selectedReward.distributionId)
            );
            setSelectedReward(null);
            setIsClaiming(false);
        }
    }, [isSuccess, selectedReward]);

    const handleClaim = async (reward: ClaimableReward) => {
        if (!address) {
            toast.error('Please connect your wallet');
            return;
        }

        setSelectedReward(reward);
        setIsClaiming(true);

        try {
            // Fetch Merkle proof from API
            const response = await fetch('/api/royalties/merkle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    distributionId: reward.distributionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate proof');
            }

            // Call smart contract to claim
            // Note: This requires the MarketGovernance contract to be deployed
            // For now, we'll show a placeholder

            toast.info('Claiming rewards... (Contract integration pending)');

            // Placeholder for actual contract call:
            /*
            writeContract({
              address: GOVERNANCE_CONTRACT_ADDRESS,
              abi: GOVERNANCE_ABI,
              functionName: 'claimRoyalty',
              args: [
                data.merkleRoot,
                BigInt(reward.amount * 1e6), // Convert to USDC decimals
                data.merkleProof,
              ],
            });
            */

        } catch (error) {
            console.error('Error claiming reward:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to claim reward');
            setIsClaiming(false);
            setSelectedReward(null);
        }
    };

    const handleBatchClaim = async () => {
        if (claimableRewards.length === 0) return;

        toast.info('Batch claiming... (Feature coming soon)');
        // Implement batch claim logic
    };

    const totalClaimable = claimableRewards.reduce((sum, r) => sum + r.amount, 0);

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                    <p className="text-muted-foreground">
                        Connect your wallet to view and claim your royalty rewards
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Gift className="w-8 h-8 text-green-500" />
                    Claim Rewards
                </h1>
                <p className="text-muted-foreground">
                    Claim your accumulated royalties from market proposals
                </p>
            </div>

            {/* Total Claimable */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Claimable</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ${totalClaimable.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {claimableRewards.length} distribution{claimableRewards.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    {claimableRewards.length > 1 && (
                        <button
                            onClick={handleBatchClaim}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                            Claim All
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Rewards List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading your rewards...</p>
                </div>
            ) : claimableRewards.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Rewards Available</h3>
                    <p className="text-muted-foreground mb-4">
                        You don't have any claimable rewards yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Create successful market proposals to earn royalties!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {claimableRewards.map((reward, index) => (
                        <motion.div
                            key={reward.distributionId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-xl bg-card border border-border hover:border-green-500/50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        <h3 className="font-semibold text-lg">
                                            ${reward.amount.toFixed(2)} USDC
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Period ending: {new Date(reward.periodEnd).toLocaleDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleClaim(reward)}
                                    disabled={isClaiming && selectedReward?.distributionId === reward.distributionId}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                                >
                                    {isClaiming && selectedReward?.distributionId === reward.distributionId ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Claiming...
                                        </span>
                                    ) : (
                                        'Claim'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-blue-400 mb-1">How Royalties Work</p>
                        <ul className="text-muted-foreground space-y-1">
                            <li>• Royalties are calculated weekly from trading fees</li>
                            <li>• You must manually claim rewards (pull-based for gas efficiency)</li>
                            <li>• Claims expire after 90 days</li>
                            <li>• Gas costs are optimized through Merkle proofs</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Transaction Status */}
            {isConfirming && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm"
                >
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <div>
                            <p className="font-semibold">Transaction Pending</p>
                            <p className="text-sm text-muted-foreground">Waiting for confirmation...</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {isSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed bottom-4 right-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4 shadow-lg max-w-sm"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="font-semibold text-green-400">Claim Successful!</p>
                            <a
                                href={`https://optimistic.etherscan.io/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                View on Explorer
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
