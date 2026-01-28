'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AIAnalysisProps {
    textToAnalyze: string;
}

export const AIAnalysisModal = ({ textToAnalyze }: AIAnalysisProps) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<'BULLISH' | 'BEARISH' | null>(null);

    const runSimulation = () => {
        setAnalyzing(true);
        setResult(null);

        // Simulate LLM Latency (1.5s - 3s)
        setTimeout(() => {
            // Deterministic "Sentiment" based on mock keywords
            const bearishKeywords = ['ban', 'hack', 'crash', 'regulation', 'sec', 'inflation'];
            const isBearish = bearishKeywords.some(w => textToAnalyze.toLowerCase().includes(w));

            setResult(isBearish ? 'BEARISH' : 'BULLISH');
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="mt-4">
            {!analyzing && !result && (
                <button
                    onClick={runSimulation}
                    className="flex items-center gap-2 text-xs font-mono text-[#00f2ea] hover:underline"
                >
                    <BrainCircuit size={14} /> ANALYZE WITH VOID AI
                </button>
            )}

            {analyzing && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#888899] animate-pulse">
                    <BrainCircuit size={14} className="animate-spin" />
                    NEURAL NET PROCESSING...
                </div>
            )}

            {result && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-xs font-bold ${result === 'BULLISH'
                            ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-[#00ff9d]'
                            : 'bg-red-500/10 border-red-500 text-red-500'
                        }`}
                >
                    {result === 'BULLISH' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    VERDICT: {result}
                </motion.div>
            )}
        </div>
    );
};
