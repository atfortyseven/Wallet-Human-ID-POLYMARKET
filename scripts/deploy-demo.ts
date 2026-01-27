import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("----------------------------------------------------");
  console.log("🕵️‍♂️  Cuenta:", deployer.address);
  // console.log("💰 Balance:", ethers.formatEther(await deployer.getBalance()), "ETH");
  console.log("----------------------------------------------------");

  // 1. OMITIMOS EL DESPLIEGUE DEL TOKEN (¡Porque ya lo tienes!)
  // Usamos la dirección que te salió en tu último intento exitoso:
  const wldAddress = "0x9dBfa9F29F86e4D197Dd1abD69A96DF59ffDD0bb"; 
  console.log("✅ Usando Token WLD existente:", wldAddress);

  // 2. Configuración
  const WORLD_ID_ROUTER = "0x42FF98C4E85212a5D31358ACbFe76a621b50fC02"; 
  const APP_ID = "app_staging_123456789"; 

  // 3. Desplegar HumanFi Governance
  console.log("🚀 Desplegando HumanFi Engine...");
  const HumanFi = await ethers.getContractFactory("HumanFiGovernance");

  // Añadimos un pequeño sobreprecio de gas para que la red nos priorice sí o sí
  // y evitar el error "underpriced".
  const feeData = await ethers.provider.getFeeData();
  
  const humanFi = await HumanFi.deploy(
    wldAddress,       
    WORLD_ID_ROUTER,  
    APP_ID,
    { 
      gasLimit: 6000000,
      // Si la red está congestionada, esto ayuda:
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    } 
  );

  await humanFi.waitForDeployment();

  const humanFiAddress = await humanFi.getAddress();
  console.log("✅ HumanFi Engine: ", humanFiAddress);

  console.log("----------------------------------------------------");
  console.log("🎉 ¡DESPLIEGUE COMPLETADO! COPIA ESTO 👇");
  console.log("");
  console.log(`NEXT_PUBLIC_WLD_TOKEN=${wldAddress}`);
  console.log(`NEXT_PUBLIC_HUMANFI_CONTRACT=${humanFiAddress}`);
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});