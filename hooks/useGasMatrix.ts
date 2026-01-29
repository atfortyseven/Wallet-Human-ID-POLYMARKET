import { useState, useEffect, useMemo } from 'react';

/**
 * useGasMatrix Hook
 * Uses Brownian Motion physics to simulate realistic EIP-1559 base fee fluctuations.
 * Predicts network congestion patterns.
 */
export const useGasMatrix = () => {
    const [baseFee, setBaseFee] = useState(15.0); // Initial Gwei

    // Brownian Motion Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setBaseFee((prev) => {
                const drift = 0.05; // Slight upward/downward trend pressure
                const volatility = 2.0; // Magnitude of change
                const change = (Math.random() - 0.5 + drift) * volatility;
                return Math.max(5, prev + change); // Minimum 5 Gwei to prevent negative
            });
        }, 2000); // Create new block simulation every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const gasMatrix = useMemo(() => {
        const eco = Number((baseFee * 0.9).toFixed(1));
        const std = Number(baseFee.toFixed(1));
        const turbo = Number((baseFee * 1.2).toFixed(1));

        // Congestion Prediction
        let congestion: 'LOW' | 'MEDIUM' | 'HIGH' | 'CLOGGED' = 'LOW';
        if (baseFee > 100) congestion = 'CLOGGED';
        else if (baseFee > 50) congestion = 'HIGH';
        else if (baseFee > 25) congestion = 'MEDIUM';

        return {
            eco,
            std,
            turbo,
            congestion,
            baseFee: std
        };
    }, [baseFee]);

    return gasMatrix;
};
