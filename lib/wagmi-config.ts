import { http, createConfig } from 'wagmi'
import { optimism } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

// 1. Usamos el Project ID que ya tienes en Railway
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '37621051039974f1c7a00f59ee5c1185';

// Token address provided by user (Ensure this matches the one in env or use one of them)
// Using value from user env vars: NEXT_PUBLIC_WLD_TOKEN_ADDRESS
export const WLD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_WLD_TOKEN_ADDRESS || '0xdc6f18f83959cd25095c2453192f16d08b496666') as `0x${string}`;

export const config = createConfig({
    chains: [optimism],
    connectors: [
        walletConnect({
            projectId,
            showQrModal: true,
            // ESTA ES LA PIEZA CLAVE: Sin esto, el QR dará error en World App
            metadata: {
                name: 'HumanID',
                description: 'Identity-based Governance',
                url: process.env.NEXT_PUBLIC_APP_URL || 'https://polymarketwallet.up.railway.app', // Must match origin
                icons: ['https://raw.githubusercontent.com/walletconnect/web3modal/master/public/logo.png'], // Standard fallback icon
            }
        }),
    ],
    transports: {
        // Usamos tu RPC de Alchemy para Optimism
        [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC || "https://mainnet.optimism.io"),
    },
})
