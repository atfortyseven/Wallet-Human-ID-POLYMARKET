import { useUSDCBalance } from './useUSDCBalance';
import { usePolymarketPositions } from './usePolymarketPositions';

export function usePolymarketData() {
    const { balance: usdcBalance, isLoading: isBalanceLoading } = useUSDCBalance();
    const { positions, totalPositionsValue, isLoading: isPositionsLoading } = usePolymarketPositions();

    // Suma total: USDC + Valor de Posiciones
    const totalPortfolioValue = (parseFloat(usdcBalance) + totalPositionsValue).toFixed(2);

    return {
        usdcBalance,
        positions,
        totalPortfolioValue,
        isLoading: isBalanceLoading || isPositionsLoading
    };
}
