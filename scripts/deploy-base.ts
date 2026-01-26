import { ethers, run, network } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🚀 Deploying to network:", network.name);
    console.log("📝 Deployer:", deployer.address);

    // Configuration for Base (Mainnet/Sepolia)
    // World ID Router Address on Base:
    // Sepolia: 0x42FF98C4E85241a8c3A04b5D2ed44F0e99FE469d
    // Mainnet: 0x330C8e52F74288011a6A11D37bd31C1c6783fdb8 (Check Docs)

    // Default to Sepolia for safety if not specified
    const WORLD_ID_ROUTER = process.env.WORLD_ID_ROUTER || "0x42FF98C4E85241a8c3A04b5D2ed44F0e99FE469d";
    const APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID || "";
    const ACTION_ID = "polymarket-wallet"; // Action defined in contracts

    if (!APP_ID) {
        throw new Error("Missing NEXT_PUBLIC_WLD_APP_ID in env");
    }

    console.log("\n📦 Deploying PolymarketGovernanceGasless...");
    const Governance = await ethers.getContractFactory("PolymarketGovernanceGasless");
    const contract = await Governance.deploy(WORLD_ID_ROUTER, APP_ID, ACTION_ID);

    await contract.deployed();

    console.log(`✅ Deployed to: ${contract.address}`);

    // Verification
    if (process.env.BASESCAN_API_KEY && network.name !== "hardhat") {
        console.log("Waiting for block confirmations...");
        await contract.deployTransaction.wait(6); // Wait 6 blocks
        console.log("Verifying on Basescan...");
        try {
            await run("verify:verify", {
                address: contract.address,
                constructorArguments: [WORLD_ID_ROUTER, APP_ID, ACTION_ID],
            });
        } catch (e) {
            console.error("Verification failed:", e);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
