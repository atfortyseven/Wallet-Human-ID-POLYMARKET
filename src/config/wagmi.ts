import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
    chains: [polygon],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    },
    connectors: [
        injected(),
        walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string }),
    ],
})
