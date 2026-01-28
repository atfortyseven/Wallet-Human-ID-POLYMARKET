import { useState, useEffect, useCallback } from 'react';

// TYPES
export type PositionType = 'LONG' | 'SHORT';

export interface Position {
    id: string;
    marketId: string;
    type: PositionType;
    entryPrice: number;
    amount: number; // In vUSD
    timestamp: number;
}

export interface PortfolioState {
    balance: number; // Available vUSD
    equity: number; // Total Value
    positions: Position[];
    totalPnL: number;
}

const INITIAL_BALANCE = 10000;
const STORAGE_KEY = 'humanid_paper_portfolio_v1';

export const usePaperTrading = () => {
    const [portfolio, setPortfolio] = useState<PortfolioState>({
        balance: INITIAL_BALANCE,
        equity: INITIAL_BALANCE,
        positions: [],
        totalPnL: 0
    });

    // 1. INIT: Load or Create Portfolio
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setPortfolio(JSON.parse(stored));
        }
    }, []);

    // 2. PERSISTENCE
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    }, [portfolio]);

    // 3. MARKET HEARTBEAT SIMULATION (Deterministic PnL)
    useEffect(() => {
        if (portfolio.positions.length === 0) return;

        const interval = setInterval(() => {
            setPortfolio(prev => {
                let currentPnL = 0;

                // Simulate fluctuation based on time & pseudo-random walk
                // In production, this would subscribe to real market price feeds
                const changes = prev.positions.map(pos => {
                    const noise = (Math.random() - 0.5) * 0.02; // +/- 1% volatility
                    const drift = pos.type === 'LONG' ? 0.001 : -0.001; // Slight bias
                    const delta = pos.amount * (drift + noise);
                    currentPnL += delta;
                    return delta; // Just for calc, strictly we'd update currentPrice
                });

                const newEquity = prev.balance + prev.positions.reduce((acc, p) => acc + p.amount, 0) + currentPnL;

                return {
                    ...prev,
                    equity: newEquity,
                    totalPnL: prev.totalPnL + currentPnL
                };
            });
        }, 3000); // 3s Heartbeat

        return () => clearInterval(interval);
    }, [portfolio.positions.length]);

    // 4. ACTIONS
    const executeOrder = useCallback((marketId: string, type: PositionType, amount: number) => {
        setPortfolio(prev => {
            if (prev.balance < amount) {
                // throw new Error("Insufficient Margin"); // Handled in UI
                return prev;
            }

            const newPosition: Position = {
                id: Math.random().toString(36).substr(2, 9),
                marketId,
                type,
                entryPrice: 1.0, // Simplified for abstract paper trading
                amount,
                timestamp: Date.now()
            };

            return {
                ...prev,
                balance: prev.balance - amount,
                positions: [...prev.positions, newPosition]
            };
        });
    }, []);

    const closePosition = useCallback((positionId: string) => {
        setPortfolio(prev => {
            const pos = prev.positions.find(p => p.id === positionId);
            if (!pos) return prev;

            // Simple closing logic: Return simulated amount + random PnL impact
            const returnAmount = pos.amount; // In real logic this depends on current price

            return {
                ...prev,
                balance: prev.balance + returnAmount,
                positions: prev.positions.filter(p => p.id !== positionId),
            };
        });
    }, []);

    const resetPortfolio = useCallback(() => {
        const resetState = {
            balance: INITIAL_BALANCE,
            equity: INITIAL_BALANCE,
            positions: [],
            totalPnL: 0
        };
        setPortfolio(resetState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
    }, []);

    return {
        portfolio,
        executeOrder,
        closePosition,
        resetPortfolio
    };
};
