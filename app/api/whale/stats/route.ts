import { NextRequest, NextResponse } from 'next/server';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || process.env.ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(config);

// Common tokens on Base to check for value (simplified for speed)
const TOKENS = [
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
  '0x4200000000000000000000000000000000000006', // WETH
  '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', // DAI
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    // Parallel fetch for speed
    const [ethBalance, tokenBalances] = await Promise.all([
      alchemy.core.getBalance(address),
      alchemy.core.getTokenBalances(address, TOKENS)
    ]);

    // Calculate generic total value (Approximate for demo)
    // In production we would need a Price Feed (CoinGecko/Chainlink)
    // Here we assume: 
    // ETH = $2500 (Hardcoded for demo speed, or fetch if needed)
    // USDC/DAI = $1
    
    // 1. ETH Value
    const ethVal = parseFloat(Utils.formatEther(ethBalance));
    const ethUsd = ethVal * 2500; 

    // 2. Token Value
    let tokenUsd = 0;
    for (const token of tokenBalances.tokenBalances) {
      if (token.tokenBalance) {
        // Primitive check: USDC/DAI have 6 or 18 decimals usually. 
        // For this demo we'll assume USDC (6 decimals) for the main stablecoin on Base
        // This is a simplification.
        if (token.contractAddress.toLowerCase() === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913') { // USDC
             const val = parseInt(token.tokenBalance, 16) / 1e6;
             tokenUsd += val;
        }
      }
    }

    const totalValue = ethUsd + tokenUsd;

    return NextResponse.json({
      address,
      totalValue,
      ethBalance: ethVal,
      isWhale: totalValue > 100000, // Threshold > $100k
    });

  } catch (error) {
    console.error('Alchemy Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
