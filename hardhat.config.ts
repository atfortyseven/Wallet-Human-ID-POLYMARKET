import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            { version: "0.8.20" },
            { version: "0.5.17" },
            { version: "0.6.12" },
        ],
    },
    networks: {
        optimismSepolia: {
            url: "https://sepolia.optimism.io",
            accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64) ? [process.env.PRIVATE_KEY] : [],
        },
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC || process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
            accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64) ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
export default config;
