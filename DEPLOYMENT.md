# Deployment Guide: Gasless System

## Quick Start (30 minutes to production)

### Step 1: WalletConnect Setup (5 min)

1. Go to https://cloud.walletconnect.com
2. Sign up / Log in
3. Click "Create Project"
4. Name: "Polymarket Wallet"
5. Copy **Project ID**
6. Save as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

---

### Step 2: Generate Relayer Wallet (2 min)

```bash
# Generate private key
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"

# Output example: 0xabcd1234...
# Save this as RELAYER_PRIVATE_KEY
```

**Derive Public Address:**
```bash
# Using ethers.js
node -e "const ethers = require('ethers'); const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY'); console.log(wallet.address);"

# Save as RELAYER_ADDRESS
```

---

### Step 3: Fund Relayer (5 min)

1. Go to https://www.alchemy.com/faucets/base-sepolia
2. Enter your `RELAYER_ADDRESS`
3. Request 0.1 ETH
4. Verify on https://sepolia.basescan.org/address/YOUR_ADDRESS

---

### Step 4: Deploy Contracts (10 min)

```bash
# 1. Deploy Governance Contract
npx hardhat run scripts/deploy-base.ts --network baseSepolia

# Output: Contract deployed to: 0x123...
# Save as NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS

# 2. Deploy Zap Contract
npx hardhat run scripts/deploy-zap-gasless.ts --network baseSepolia

# Output: Contract deployed to: 0x456...
# Save as NEXT_PUBLIC_ZAP_GASLESS_CONTRACT_ADDRESS
```

---

### Step 5: Configure Railway (5 min)

1. Go to Railway Dashboard
2. Select your project
3. Click "Variables"
4. Add all variables from `.env.production.template`
5. Click "Deploy"

**Required Variables:**
```bash
NEXT_PUBLIC_POLYMARKET_API_URL="https://clob.polymarket.com"
NEXT_PUBLIC_ALCHEMY_API_KEY="your_alchemy_key_here"
NEXT_PUBLIC_WALLET_CONNECT_ID="your_wallet_connect_id"
BASE_MAINNET_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
DATABASE_URL="postgresql://..." 
JWT_SECRET="your_jwt_secret_here"
MONGODB_URI="mongodb+srv://..."
NEXT_PUBLIC_APP_URL="https://polymarketwallet.up.railway.app"
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your_project_id"
NEXT_PUBLIC_WLD_ACTION_LOGIN="login"
NIXPACKS_NODE_VERSION="22.13.0"
OPENAI_API_KEY="sk-..."
PM_CONFIG_PRODUCTION="false"
PRIVATE_KEY="0x..."
RELAYER_PRIVATE_KEY="your_relayer_private_key"
WORLD_ID_ROUTER="id.worldcoin.eth"
NEXT_PUBLIC_WLD_APP_ID="app_..."
NEWS_API_KEY="your_news_api_key"
NEXT_PUBLIC_HUMANFI_CONTRACT="0x42eEf0899F733Ff812d937DB04ec45C00324c2c4"
NEXT_PUBLIC_NEWS_API_KEY="pub_..."
NEXT_PUBLIC_OPTIMISM_RPC="https://opt-mainnet.g.alchemy.com/v2/your_key"
NEXT_PUBLIC_WC_PROJECT_ID="your_wc_project_id"
NEXT_PUBLIC_WLD_TOKEN="0x9dBfa9F29F86e4D197Dd1abD69A96DF59ffDD0bb"
NEXT_PUBLIC_WLD_TOKEN_ADDRESS="0xdc6f18f83959cd25095c2453192f16d08b496666"
```

---

### Step 6: Verify Deployment (3 min)

1. Visit your Railway URL
2. Connect wallet
3. Try a small zap (1 WLD)
4. Check transaction on Basescan

---

## Troubleshooting

### Issue: "Unknown Network"
**Solution:** Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### Issue: "Relayer out of funds"
**Solution:** Fund relayer wallet with more ETH

### Issue: "Contract not found"
**Solution:** Verify contract addresses are correct

### Issue: "Signature verification failed"
**Solution:** Check chainId matches (84532 for Base Sepolia)

---

## Monitoring

### Check Relayer Balance
```bash
curl "https://sepolia.base.org" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["YOUR_RELAYER_ADDRESS","latest"],"id":1}'
```

### Check Transaction Status
```bash
# Visit
https://sepolia.basescan.org/address/YOUR_RELAYER_ADDRESS
```

---

## Maintenance

### Weekly Tasks
- [ ] Check relayer balance
- [ ] Review error logs
- [ ] Monitor gas prices

### Monthly Tasks
- [ ] Rotate JWT_SECRET
- [ ] Review security
- [ ] Update dependencies

---

**Need Help?** Check `TESTING.md` for detailed test cases.
