import { ethers } from "hardhat";

async function main() {
    console.log("🚀 Deploying HumanFiGovernance to Optimism Sepolia...\n");

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    // World ID Router on Optimism Sepolia
    const WORLD_ID_ROUTER = "0x11cA3127182f7583EdC4d6343471e4320a77b639";

    // Your World ID App ID (from environment or hardcoded)
    const APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID || "app_d2014c58bb084dcb09e1f3c1c1144287";

    // ZapContract address (deploy ZapContract first, or use existing)
    // For now, we'll use a placeholder - you'll need to deploy ZapContract separately
    const ZAP_CONTRACT = process.env.ZAP_CONTRACT_ADDRESS || ethers.constants.AddressZero;

    console.log("Configuration:");
    console.log("- World ID Router:", WORLD_ID_ROUTER);
    console.log("- App ID:", APP_ID);
    console.log("- Zap Contract:", ZAP_CONTRACT);
    console.log("");

    // ============================================================================
    // DEPLOYMENT
    // ============================================================================

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

    // Deploy HumanFiGovernance
    console.log("Deploying HumanFiGovernance...");
    const HumanFiGovernance = await ethers.getContractFactory("HumanFiGovernance");
    const humanFi = await HumanFiGovernance.deploy(
        WORLD_ID_ROUTER,
        APP_ID,
        ZAP_CONTRACT
    );

    await humanFi.deployed();

    console.log("✅ HumanFiGovernance deployed to:", humanFi.address);
    console.log("");

    // ============================================================================
    // VERIFICATION INFO
    // ============================================================================

    console.log("📝 To verify on Etherscan, run:");
    console.log(`npx hardhat verify --network optimismSepolia ${humanFi.address} "${WORLD_ID_ROUTER}" "${APP_ID}" "${ZAP_CONTRACT}"`);
    console.log("");

    // ============================================================================
    // SAVE DEPLOYMENT
    // ============================================================================

    const deployment = {
        network: "optimismSepolia",
        chainId: 11155420,
        contracts: {
            HumanFiGovernance: humanFi.address,
            WorldIDRouter: WORLD_ID_ROUTER,
            ZapContract: ZAP_CONTRACT
        },
        appId: APP_ID,
        deployedAt: new Date().toISOString(),
        deployer: deployer.address
    };

    console.log("📄 Deployment info:");
    console.log(JSON.stringify(deployment, null, 2));
    console.log("");

    // Save to file
    const fs = require("fs");
    const path = require("path");

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const filename = `humanfi-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(deployment, null, 2)
    );

    console.log(`✅ Deployment saved to: deployments/${filename}`);
    console.log("");
    console.log("🎉 Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
