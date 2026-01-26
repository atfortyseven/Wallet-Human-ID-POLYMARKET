export type Sentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface NewsItem {
    id: string;
    title: string;
    topic: string; // e.g., "US Politics", "Crypto"
    sentiment: Sentiment;
    timestamp: string;
}

export interface Position {
    id: string;
    marketTitle: string;
    outcome: 'YES' | 'NO';
    shares: number;
    avgPrice?: number;
    currentPrice?: number;
    value?: number; // Hook adds this
    pnl: number;
    pnlPercent: number;
    relatedNewsId?: string;
    newsContext?: string; // Hook adds this
}

export interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'BUY' | 'SELL' | 'WINNINGS';
    amount: number;
    asset: string; // "USDC"
    date: string;
    status: 'COMPLETED' | 'PENDING';
    newsContext?: {
        newsId: string;
        headline: string;
        impactLabel: string; // e.g. "Triggered by Biden Dropout"
    };
}

export interface WalletState {
    balance: number;
    idleCash: number;
    activeValue: number;
    yieldEnabled: boolean; // For the "Earn 4%" toggle
    isGasless: boolean;
}
