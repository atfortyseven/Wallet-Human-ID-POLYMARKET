import { Address } from "viem";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

// USDC Contract Addresses per Chain
export const USDC_ADDRESSES: Record<number, Address> = {
    [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    [polygon.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Bridged USDC
    [optimism.id]: "0x0b2C639c5343465d47499142552a7ba59dd7346F", // Native USDC
    [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Native USDC
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Native USDC
    [84532]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
};

export const getUsdcAddress = (chainId: number): Address | undefined => {
    return USDC_ADDRESSES[chainId];
};

export const WLD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_WLD_TOKEN_ADDRESS || '0xdc6f18f83959cd25095c2453192f16d08b496666') as `0x${string}`;

export const TOKENS_BY_CHAIN: Record<number, any[]> = {
    [mainnet.id]: [
        { symbol: 'USDC', name: 'USD Coin', address: USDC_ADDRESSES[mainnet.id], decimals: 6 },
    ],
    [base.id]: [
        { symbol: 'USDC', name: 'USD Coin', address: USDC_ADDRESSES[base.id], decimals: 6 },
    ],
    [84532]: [
        { symbol: 'USDC', name: 'USD Coin', address: USDC_ADDRESSES[84532], decimals: 6 },
    ]
};

export const getSupportedTokens = (chainId: number) => {
    return TOKENS_BY_CHAIN[chainId] || [];
};
