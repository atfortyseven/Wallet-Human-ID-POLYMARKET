import { createAppKit } from '@reown/appkit/react'
// Config clean-up verification
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, optimism, base, baseSepolia, arbitrum, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// 1. Get projectId
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// 2. Set the networks
export const networks = [baseSepolia, base, mainnet, optimism, arbitrum, polygon] as [AppKitNetwork, ...AppKitNetwork[]];

// 3. Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    ssr: false,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig as Config

// 4. Create the modal
const metadata = {
    name: 'HumanID',
    description: 'The Void Wallet',
    url: 'https://humanid.fi', // origin must match your domain & subdomain
    icons: ['https://humanid.fi/android-chrome-192x192.png']
}

createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true,
        email: false, // Optional - disable email login if not needed to reduce complexity
        socials: [], // Optional - disable social login if causing config issues
    },
    themeMode: 'dark',
})

// 5. Create the wrapper component
export function Web3ModalProvider({ children, cookies }: { children: ReactNode; cookies?: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
