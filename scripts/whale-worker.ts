import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Alchemy Configuration
const config = {
  apiKey: process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "p2MK6Y8eQyHPbS5gQZ7TU",
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(config);
const WHALE_THRESHOLD_USD = 50000; // $50k threshold for whale detection

async function main() {
  console.log("🐋 [Whale Worker] Background monitoring started on Base Mainnet...");
  
  let lastProcessedBlock = await alchemy.core.getBlockNumber();
  console.log(`📡 [Whale Worker] Starting from block: ${lastProcessedBlock}`);

  // Infinite poll loop
  while (true) {
    try {
      const currentBlock = await alchemy.core.getBlockNumber();
      
      if (currentBlock > lastProcessedBlock) {
        console.log(`🔍 [Whale Worker] Processing blocks ${lastProcessedBlock + 1} to ${currentBlock}...`);
        
        const transfers = await alchemy.core.getAssetTransfers({
          fromBlock: `0x${(lastProcessedBlock + 1).toString(16)}`,
          toBlock: `0x${currentBlock.toString(16)}`,
          category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
          excludeZeroValue: true,
          order: SortingOrder.DESCENDING,
        });

        for (const tx of transfers.transfers) {
          // Fetch token price or use a conservative estimated value for common tokens (ETH/USDC)
          // For now, we simulate the USD calculation or fetch via Simple Price API
          // To keep it simple and fast, we check if it's ETH > 15 (~$50k) or USDC > 50000
          
          let usdValue = 0;
          if (tx.asset === "ETH") usdValue = (tx.value || 0) * 3300;
          else if (tx.asset === "USDC" || tx.asset === "USDT" || tx.asset === "DAI") usdValue = tx.value || 0;
          else {
            // Generic token - assume $50k if value > 100000 (simplified)
            usdValue = (tx.value || 0) * 0.1; 
          }

          if (usdValue >= WHALE_THRESHOLD_USD) {
            console.log(`🌊 [Whale Worker] Detected Whale Move: ${usdValue.toFixed(2)} USD (${tx.asset})`);
            
            // Save to database
            await prisma.whaleActivity.upsert({
              where: { transactionHash: tx.hash },
              update: {},
              create: {
                walletAddress: tx.from,
                type: tx.to === null ? "CONTRACT" : "TRANSFER",
                token: tx.asset || "TOKEN",
                amount: tx.value || 0,
                usdValue: usdValue,
                fromAddress: tx.from,
                toAddress: tx.to || "Contract",
                transactionHash: tx.hash,
                blockNumber: BigInt(parseInt(tx.blockNum, 16)),
                timestamp: new Date(),
              }
            });
          }
        }
        
        lastProcessedBlock = currentBlock;
      }
      
      // Wait 10 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.error("❌ [Whale Worker] Error in worker loop:", error);
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait longer on error
    }
  }
}

main().catch(err => {
  console.error("💀 [Whale Worker] Fatal error:", err);
  process.exit(1);
});
