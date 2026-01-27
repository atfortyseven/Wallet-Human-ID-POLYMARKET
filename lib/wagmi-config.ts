import { http, createConfig } from 'wagmi'
import { optimism } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

// Contrato Oficial de WLD en Optimism (Provided by User)
export const WLD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_WLD_TOKEN_ADDRESS || '0x7fd911b55514a6f8d2d04f854667b2c3ef09175b') as `0x${string}`;

export const config = createConfig({
    chains: [optimism], // Forzamos Optimism para evitar errores de red
    connectors: [
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
            showQrModal: true
        }),
    ],
    transports: {
        [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC || "https://mainnet.optimism.io"),
    },
})
