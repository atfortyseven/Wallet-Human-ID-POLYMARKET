const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error("❌ No deployer account found! Please check your .env file and ensure PRIVATE_KEY is set and valid (starts with 0x...).");
    }
    console.log("🚀 Desplegando contratos con la cuenta:", deployer.address);

    // ---------------------------------------------------------
    // 1. DESPLEGAR CONDITIONAL TOKENS (CORE)
    // ---------------------------------------------------------
    // We need to check if we can get the factory directly.
    // Sometimes external artifacts are not available via getContractFactory without extra steps.
    // If this fails, we might need to use a different approach (e.g., verifying imports).
    let ConditionalTokens;
    try {
        ConditionalTokens = await hre.ethers.getContractFactory("ConditionalTokens");
    } catch (e) {
        console.log("⚠️ Could not get factory for ConditionalTokens directly. Ensuring artifacts are present.");
        // If we can't find it, we might need to rely on importing it in a solidity file.
        throw e;
    }

    const conditionalTokens = await ConditionalTokens.deploy();
    await conditionalTokens.waitForDeployment();
    const ctAddress = await conditionalTokens.getAddress();

    console.log("\n✅ NEXT_PUBLIC_CTF_ADDRESS:");
    console.log(ctAddress);

    // ---------------------------------------------------------
    // 2. DESPLEGAR FPMM FACTORY (MARKET MAKER)
    // ---------------------------------------------------------
    // La factoría necesita saber dónde está el ConditionalTokens
    const FixedProductMarketMakerFactory = await hre.ethers.getContractFactory("FixedProductMarketMakerFactory");
    const fpmmFactory = await FixedProductMarketMakerFactory.deploy();
    await fpmmFactory.waitForDeployment();
    const factoryAddress = await fpmmFactory.getAddress();

    console.log("\n✅ NEXT_PUBLIC_FPMM_FACTORY_ADDRESS:");
    console.log(factoryAddress);

    // ---------------------------------------------------------
    // 3. DESPLEGAR COLLATERAL DE PRUEBA (MOCK USDC)
    // ---------------------------------------------------------
    // Esto es útil para desarrollo. En producción usarás el USDC real.
    // Creamos un token ERC20 simple.
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");

    try {
        const mockToken = await MockERC20.deploy("Test USDC", "tUSDC", hre.ethers.parseEther("1000000")); // 1M tokens iniciales
        await mockToken.waitForDeployment();
        const tokenAddress = await mockToken.getAddress();

        console.log("\n✅ NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS (Test USDC):");
        console.log(tokenAddress);
    } catch (error) {
        console.log("\n⚠️ Error deploying MockERC20:", error);
    }

    // ---------------------------------------------------------
    // 4. NOTA SOBRE EL ORÁCULO
    // ---------------------------------------------------------
    console.log("\n⚠️ NEXT_PUBLIC_ORACLE_ADDRESS:");
    console.log("Para el oráculo, necesitas desplegar tu adaptador de UMA o usar una dirección existente.");
    console.log("Si aún no tienes el adaptador, este paso queda pendiente.");

    console.log("\n---------------------------------------------------------");
    console.log("🎉 ¡DESPLIEGUE COMPLETADO! Copia los valores de arriba a Railway.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
