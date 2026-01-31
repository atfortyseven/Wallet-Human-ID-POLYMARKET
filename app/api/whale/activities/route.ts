import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch large transfers (Whale Activity)
    // We filter for large values of stablecoins or ETH
    let transfers;
    try {
        transfers = await alchemy.core.getAssetTransfers({
            fromBlock: '0x0',
            toBlock: 'latest',
            category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: 20,
            order: SortingOrder.DESCENDING,
        });
    } catch (apiError: any) {
        console.warn("[Alchemy Error] Returning empty activities:", apiError.message);
        return NextResponse.json({
            activities: [],
            timestamp: Date.now(),
            fallback: true
        });
    }

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
