import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { polygon, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
    chains: [polygon, baseSepolia],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
        [baseSepolia.id]: http("https://sepolia.base.org"),
    },
    connectors: [
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c0f7329d55474325a75cf015f5d3419f' // Fallback to avoid crash
        }),
    ],
})
