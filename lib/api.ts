import { Order } from "./eip712";

const CLOB_API_URL = "https://clob.polymarket.com"; // Mainnet URL

// Mock Market Interface
export interface Market {
    question: string;
    conditionId: string;
    slug: string;
    tokens: {
        outcome: string;
        tokenId: string;
        price: number;
    }[];
    volume: number;
    endDate: string;
}

export async function getMarkets(): Promise<Market[]> {
    try {
        // In a real app, you would fetch from the CLOB API or The Graph
        // Fetching top markets from a simplified endpoint or mocking for now to ensure robustness
        const response = await fetch(`${CLOB_API_URL}/markets`);
        if (!response.ok) {
            // Fallback mock data if API fails or requires specific auth headers we haven't set up fully yet
            console.warn("API request failed, returning mock data");
            return MOCK_MARKETS;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch markets", error);
        return MOCK_MARKETS;
    }
}

export async function postOrder(order: Order, signature: string) {
    const payload = {
        order,
        owner: order.maker,
        orderType: "GTC", // Good Till Cancelled
        signature,
    };

    const response = await fetch(`${CLOB_API_URL}/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `...` // SIWE Headers would go here
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Failed to post order");
    }

    return response.json();
}

const MOCK_MARKETS: Market[] = [
    {
        question: "Will Bitcoin hit $100k in 2024?",
        conditionId: "0x123...",
        slug: "btc-100k-2024",
        tokens: [
            { outcome: "Yes", tokenId: "1", price: 0.65 },
            { outcome: "No", tokenId: "2", price: 0.35 },
        ],
        volume: 15000000,
        endDate: "2024-12-31"
    },
    {
        question: "Will Fedora coin flip Ethereum?",
        conditionId: "0x456...",
        slug: "fedora-flip-eth",
        tokens: [
            { outcome: "Yes", tokenId: "3", price: 0.05 },
            { outcome: "No", tokenId: "4", price: 0.95 },
        ],
        volume: 250000,
        endDate: "2025-01-01"
    }
];
