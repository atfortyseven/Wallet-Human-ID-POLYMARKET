import { useState, useMemo, useEffect } from 'react';

/**
 * useAiSentiment Hook
 * Simulates an NLP engine analyzing 50 headlines.
 * Calculates "Fear & Greed" index to 2 decimal places.
 * Extracts trending keywords.
 */
export const useAiSentiment = () => {
    const [analyzing, setAnalyzing] = useState(true);

    // Simulate initial analysis delay
    useEffect(() => {
        const timer = setTimeout(() => setAnalyzing(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const sentimentData = useMemo(() => {
        // Deterministic simulation based on time blocks to keep it stable-ish during render
        const timestamp = Math.floor(Date.now() / 1000 / 60); // Changes every minute

        // Fear & Greed Index logic (simulated volatility)
        // Base 50 + sine wave fluctuation + random noise
        const rawScore = 50 + (Math.sin(timestamp) * 20) + (Math.random() * 10 - 5);
        const fearGreedIndex = Math.max(0, Math.min(100, Number(rawScore.toFixed(2))));

        // Determine State
        let state: 'EXTREME FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME GREED' = 'NEUTRAL';
        if (fearGreedIndex < 25) state = 'EXTREME FEAR';
        else if (fearGreedIndex < 45) state = 'FEAR';
        else if (fearGreedIndex < 55) state = 'NEUTRAL';
        else if (fearGreedIndex < 75) state = 'GREED';
        else state = 'EXTREME GREED';

        // Simulated Trending Keywords
        const keywords = [
            { tag: 'ZK-Rollups', weight: 0.9 },
            { tag: 'Lens Protocol', weight: 0.85 },
            { tag: 'EigenLayer', weight: 0.8 },
            { tag: 'Account Abstraction', weight: 0.75 },
            { tag: 'L3 Chains', weight: 0.6 }
        ];

        return {
            score: fearGreedIndex,
            state,
            keywords,
            analysisCount: 50, // Headlines analyzed
        };
    }, [analyzing]);

    return { ...sentimentData, isLoading: analyzing };
};
