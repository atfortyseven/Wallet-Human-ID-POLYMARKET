const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Desplegando MockERC20 con la cuenta:", deployer.address);

    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("Test USDC", "tUSDC", hre.ethers.parseEther("1000000"));
    await mockToken.waitForDeployment();
    const tokenAddress = await mockToken.getAddress();

    console.log("\n✅ NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS (Test USDC):");
    console.log(tokenAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
