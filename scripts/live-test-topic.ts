import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import fetch from 'node-fetch';

// Polyfill for fetch
if (!global.fetch) {
  (global as any).fetch = fetch;
}

const ALCHEMY_KEY = "p2MK6Y8eQyHPbS5gQZ7TU"; 
const BOT_TOKEN = "8400528150:AAGtzfSpSvD6HgauHwg7Nw3sGElQx1Ug4rg";
const CHAT_ID = "-1002462382947"; // ID del Grupo (obtenido del link t.me/c/2462382947/...) -> -100 + 2462382947
// WAIT, the user link was https://t.me/HumanidFi/1367
// HumanidFi is a public username. So chat_id is @HumanidFi
// But topics usually require a supergroup ID (-100...).
// If HumanidFi is a supergroup, its ID is needed.
// Only sending to @HumanidFi might not work with topics if the bot isn't admin or if it needs the numeric ID.
// However, let's try sending to @HumanidFi first with message_thread_id. 
// IF that fails, we might need the numeric ID.
// The user's link "https://t.me/HumanidFi/1367" implies the group/channel username is HumanidFi.

const TARGET_CHAT_ID = "@HumanidFi"; 
const TOPIC_ID = 1367;

console.log("🚀 Starting LIVE Topic Test...");

const config = {
  apiKey: ALCHEMY_KEY,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(config);

async function sendTelegram(text: string) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TARGET_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        message_thread_id: TOPIC_ID
      }),
    });
    const json = await res.json();
    console.log("Telegram Response:", json);
    return res.ok;
  } catch (e) {
    console.error("Telegram Error:", e);
    return false;
  }
}

async function run() {
  try {
    // 1. Get latest block
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log(`Scanning Base mainnet from block ${latestBlock - 100}...`);

    // 2. Fetch Transfers (ERC20)
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: `0x${(latestBlock - 100).toString(16)}`,
      toBlock: 'latest',
      category: [AssetTransfersCategory.ERC20],
      maxCount: 50,
      order: SortingOrder.DESCENDING,
      excludeZeroValue: true,
    });

    console.log(`Found ${transfers.transfers.length} transfers.`);

    // 3. Find significant one
    let whaleTx = null;
    let maxVal = 0;

    for (const tx of transfers.transfers) {
      let usdValue = 0;
      const val = tx.value || 0;
      
      // Rough estimates
      if (['USDC', 'USDT', 'DAI'].includes(tx.asset || '')) usdValue = val;
      else if (tx.asset === 'WETH' || tx.asset === 'CBETH') usdValue = val * 3200;
      else if (tx.asset === 'AERO') usdValue = val * 1.2;
      else usdValue = val * 0.5; // fallback

      // Lower threshold for TEST to ensure we get SOMETHING
      if (usdValue > 1000) { 
        if (usdValue > maxVal) {
          maxVal = usdValue;
          whaleTx = { ...tx, usdValue };
        }
      }
    }

    if (!whaleTx) {
      console.log("No significant transactions found in last 100 blocks.");
      return;
    }

    // 4. Send Alert
    console.log(`Sending alert for ${whaleTx.usdValue.toFixed(2)} USD (${whaleTx.asset})...`);

      const formatMoney = (val: number) => {
      const eurVal = val * 0.96;
      const millions = (eurVal / 1_000_000).toFixed(2);
      return `€${millions} Millones de euros`;
    };

    const shortFrom = `${whaleTx.from.slice(0, 4)}...${whaleTx.from.slice(-4)}`;
    const shortTo = whaleTx.to ? `${whaleTx.to.slice(0, 4)}...${whaleTx.to.slice(-4)}` : 'Contract 📄';
      
    const msg = `
${'🐋'} <b>ALERTA WHALE (PRUEBA EN VIVO)</b> | Base

💶 <b>${formatMoney(whaleTx.usdValue)}</b>
Transferencia de <b>${parseFloat((whaleTx.value || 0).toFixed(2)).toLocaleString()} ${whaleTx.asset || 'Token'}</b> detectada AHORA MISMO.

👤 <code>${shortFrom}</code> ➡️ <code>${shortTo}</code>

🔗 <a href="https://basescan.org/tx/${whaleTx.hash}">Ver Transacción Real</a>
`.trim();

    await sendTelegram(msg);

  } catch (error) {
    console.error("Script failed:", error);
  }
}

run();
