import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Deploy ZapContractGasless to Base Sepolia
 * 
 * This script deploys the gasless version of ZapContract which allows users
 * to execute zaps without paying gas fees. A relayer pays the gas instead.
 */
async function main() {
    console.log("\n🚀 Deploying ZapContractGasless to Base Sepolia...\n");

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    // Base Sepolia addresses
    const WLD_TOKEN = "0x..."; // TODO: Add actual WLD token address on Base Sepolia
    const USDC_TOKEN = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC on Base Sepolia
    const SWAP_ROUTER = "0x..."; // TODO: Add Uniswap V3 Router on Base Sepolia
    const CTF_EXCHANGE = "0x..."; // TODO: Add Polymarket CTF Exchange on Base Sepolia
    const PERMIT2 = ethers.ZeroAddress; // Optional, set to address(0) if not using
    const TREASURY = process.env.TREASURY_ADDRESS || "0x..."; // TODO: Set treasury address

    console.log("📋 Configuration:");
    console.log(`   WLD Token: ${WLD_TOKEN}`);
    console.log(`   USDC Token: ${USDC_TOKEN}`);
    console.log(`   Swap Router: ${SWAP_ROUTER}`);
    console.log(`   CTF Exchange: ${CTF_EXCHANGE}`);
    console.log(`   Treasury: ${TREASURY}\n`);

    // ========================================================================
    // DEPLOY CONTRACT
    // ========================================================================

    const [deployer] = await ethers.getSigners();
    console.log(`🔑 Deploying from: ${deployer.address}`);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);

    console.log("📦 Deploying ZapContractGasless...");

    const ZapContractGasless = await ethers.getContractFactory("ZapContractGasless");
    const zapContract = await ZapContractGasless.deploy(
        WLD_TOKEN,
        USDC_TOKEN,
        CTF_EXCHANGE,
        SWAP_ROUTER,
        PERMIT2,
        TREASURY
    );

    await zapContract.waitForDeployment();
    const contractAddress = await zapContract.getAddress();

    console.log(`✅ ZapContractGasless deployed to: ${contractAddress}\n`);

    // ========================================================================
    // VERIFY DEPLOYMENT
    // ========================================================================

    console.log("🔍 Verifying deployment...");

    const wldToken = await zapContract.WLD_TOKEN();
    const usdcToken = await zapContract.USDC_TOKEN();
    const ctfExchange = await zapContract.CTF_EXCHANGE();
    const swapRouter = await zapContract.SWAP_ROUTER();
    const treasuryAddr = await zapContract.treasury();
    const protocolFee = await zapContract.protocolFeeBps();

    console.log("   WLD Token:", wldToken);
    console.log("   USDC Token:", usdcToken);
    console.log("   CTF Exchange:", ctfExchange);
    console.log("   Swap Router:", swapRouter);
    console.log("   Treasury:", treasuryAddr);
    console.log("   Protocol Fee:", protocolFee.toString(), "bps\n");

    // ========================================================================
    // SAVE DEPLOYMENT INFO
    // ========================================================================

    const deploymentInfo = {
        network: "baseSepolia",
        contractAddress: contractAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        config: {
            wldToken: WLD_TOKEN,
            usdcToken: USDC_TOKEN,
            ctfExchange: CTF_EXCHANGE,
            swapRouter: SWAP_ROUTER,
            permit2: PERMIT2,
            treasury: TREASURY
        }
    };

    console.log("💾 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // ========================================================================
    // VERIFICATION COMMAND
    // ========================================================================

    console.log("\n📝 To verify on Basescan, run:");
    console.log(`npx hardhat verify --network baseSepolia ${contractAddress} \\`);
    console.log(`  "${WLD_TOKEN}" \\`);
    console.log(`  "${USDC_TOKEN}" \\`);
    console.log(`  "${CTF_EXCHANGE}" \\`);
    console.log(`  "${SWAP_ROUTER}" \\`);
    console.log(`  "${PERMIT2}" \\`);
    console.log(`  "${TREASURY}"`);

    // ========================================================================
    // NEXT STEPS
    // ========================================================================

    console.log("\n✅ Deployment Complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Add to Railway environment variables:");
    console.log(`   NEXT_PUBLIC_ZAP_GASLESS_CONTRACT_ADDRESS="${contractAddress}"`);
    console.log("\n2. Verify contract on Basescan (command above)");
    console.log("\n3. Test gasless zap from frontend");
    console.log("\n4. Monitor relayer gas usage\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
