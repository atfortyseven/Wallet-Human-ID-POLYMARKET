import { useState, useEffect, useCallback } from 'react';

interface GasData {
    gasPrices: {
        eco: number;
        standard: number;
        turbo: number;
    };
    networkLoad: number; // 0-100%
    forecast: 'RISING_FAST' | 'STABLE' | 'DROPPING';
    baseFee: number;
}

export function useGasMatrix() {
    const [history, setHistory] = useState<number[]>(Array(20).fill(15)); // Last 20 block base fees
    const [data, setData] = useState<GasData>({
        gasPrices: { eco: 10, standard: 15, turbo: 20 },
        networkLoad: 45,
        forecast: 'STABLE',
        baseFee: 15
    });

    // Simulate Brownian Motion for Base Fee
    const simulateBlock = useCallback(() => {
        setHistory(prevHistory => {
            const lastFee = prevHistory[prevHistory.length - 1];

            // Random Drift (Brownian Motion)
            // Delta is normally distributed around 0
            const delta = (Math.random() - 0.5) * 4; // +/- 2 Gwei volatility

            let newFee = lastFee + delta;
            // Mean reversion to keep it realistic (e.g., center around 15 Gwei)
            newFee += (15 - newFee) * 0.1;

            // Clamp to realistic values
            newFee = Math.max(5, Math.min(200, newFee));

            const newHistory = [...prevHistory.slice(1), newFee];

            // Analyze Trend
            const start = newHistory[0];
            const end = newHistory[newHistory.length - 1];
            const diff = end - start;

            let forecast: 'RISING_FAST' | 'STABLE' | 'DROPPING' = 'STABLE';
            if (diff > 5) forecast = 'RISING_FAST';
            else if (diff < -5) forecast = 'DROPPING';

            // Load Calculation (Correlated to price)
            const load = Math.min(99, Math.max(10, (newFee / 30) * 100));

            // Set Public Data
            setData({
                gasPrices: {
                    eco: Math.round(newFee * 0.9),
                    standard: Math.round(newFee),
                    turbo: Math.round(newFee * 1.5)
                },
                networkLoad: Math.round(load),
                forecast,
                baseFee: parseFloat(newFee.toFixed(2))
            });

            return newHistory;
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(simulateBlock, 3000); // New block every 3s (Layer 2 speed)
        return () => clearInterval(interval);
    }, [simulateBlock]);

    return data;
}
