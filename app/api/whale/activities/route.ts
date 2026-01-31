import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';

// Configure Alchemy
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || process.env.ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};

// HACK: Fix for Alchemy SDK "Referrer 'client' is not a valid URL" in Next.js Server
// The SDK sets 'client' as referrer which native fetch rejects.
const originalFetch = global.fetch;
global.fetch = (url, init) => {
    if (init && init.referrer === 'client') {
        delete init.referrer;
    }
    return originalFetch(url, init);
};

const alchemy = new Alchemy(config);

const KNOWN_WHALES: Record<string, string> = {
  '0x28C6c06298d514Db089934071355E5743bf21d60': 'Binance Hot Wallet',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb': 'Coinbase',
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': 'USDC Contract',
};

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch large transfers (Whale Activity)
    // We filter for large values of stablecoins or ETH
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      toBlock: 'latest',
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
      withMetadata: true,
      excludeZeroValue: true,
      maxCount: 20,
      order: SortingOrder.DESCENDING,
    });

    // Map to our internal interface
    const activities = transfers.transfers
      .filter(tx => tx.value && tx.value > 10000) // Filter: > 10k value (approx for simplicity)
      .map(tx => ({
        id: tx.hash,
        walletAddress: tx.from,
        walletLabel: KNOWN_WHALES[tx.from] || `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`,
        type: 'TRANSFER', // Infer type based on context if possible
        token: tx.asset || 'ETH',
        amount: tx.value || 0,
        usdValue: (tx.value || 0) * 1, // Placeholder: In prod we'd fetch price prices
        timestamp: new Date(tx.metadata.blockTimestamp),
        txHash: tx.hash,
      }));

    return NextResponse.json({
      activities,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[API ERROR] Whale activities:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
