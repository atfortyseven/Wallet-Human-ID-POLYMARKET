/**
 * RiskCapitalBanner Component
 * 
 * Psychological UI that shows "house money" available for betting
 * Implements the "House Money Effect" to increase risk tolerance
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, X, Sparkles } from 'lucide-react';
import { useWLDBalance, useZapEstimate } from '@/hooks/useWLDBalance';
import { formatUnits, parseUnits } from 'viem';

interface RiskCapitalBannerProps {
    onZapClick?: (wldAmount: bigint) => void;
    minThreshold?: number; // Minimum USD to show banner
}

export function RiskCapitalBanner({
    onZapClick,
    minThreshold = 10
}: RiskCapitalBannerProps) {
    const { balanceUSD, balance, balanceFormatted, hasRiskCapital, isLoading } =
        useWLDBalance(minThreshold);

    const [isDismissed, setIsDismissed] = useState(false);
    const [zapAmount, setZapAmount] = useState(balance);

    const { data: zapEstimate } = useZapEstimate(zapAmount);

    // Don't show if dismissed, loading, or no risk capital
    if (isDismissed || isLoading || !hasRiskCapital) {
        return null;
    }

    const handleZap = () => {
        if (onZapClick) {
            onZapClick(zapAmount);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-[2px] shadow-2xl"
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-75 blur-xl animate-pulse" />

                <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-6">
                    {/* Close button */}
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-75 animate-pulse" />
                                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Risk Capital Available
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        🎰
                                    </motion.span>
                                </h3>
                                <p className="text-sm text-white/70 mt-1">
                                    You have <span className="font-semibold text-purple-300">house money</span> ready to deploy
                                </p>
                            </div>

                            {/* Balance Display */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                        ${balanceUSD.toFixed(2)}
                                    </span>
                                    <span className="text-white/50 text-sm">
                                        ({balanceFormatted} WLD)
                                    </span>
                                </div>

                                {zapEstimate && (
                                    <div className="mt-2 text-sm text-white/60">
                                        ≈ {zapEstimate.estimatedShares.toFixed(2)} shares after fees
                                    </div>
                                )}
                            </div>

                            {/* Psychological Messaging */}
                            <div className="flex items-start gap-2 text-sm text-white/80">
                                <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <p>
                                    <span className="font-semibold text-green-300">Pro tip:</span> Grant money
                                    has higher risk tolerance. Use it to explore new markets!
                                </p>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleZap}
                                className="group relative w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Convert to Bet
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </button>

                            {/* Fine print */}
                            <p className="text-xs text-white/40 text-center">
                                Atomic transaction • MEV protected • ~{zapEstimate?.estimatedSlippage.toFixed(2)}% slippage
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Compact version for dashboard
 */
export function RiskCapitalBadge() {
    const { balanceUSD, hasRiskCapital, isLoading } = useWLDBalance();

    if (isLoading || !hasRiskCapital) {
        return null;
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2"
        >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
                ${balanceUSD.toFixed(2)} Risk Capital
            </span>
        </motion.div>
    );
}
