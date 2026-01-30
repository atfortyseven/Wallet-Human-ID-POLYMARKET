"use client";

import { useTheme } from "next-themes";
import { CreateConnectorFn, WagmiProvider, cookieToInitialState } from 'wagmi';
import { AppKitNetwork } from "@reown/appkit/networks";

// 1. Get projectId from https://cloud.walletconnect.com
// 1. Get projectId
// Fallback to a generous default if env is missing to prevent crash
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "37621051039974f1c7a00f59ee5c1185";

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    console.warn("Using fallback WalletConnect Project ID. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.");
}

// 2. Create wagmiConfig
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base, baseSepolia } from '@reown/appkit/networks'

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia, mainnet, arbitrum, base];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig

// 3. Create modal
import { createAppKit } from '@reown/appkit/react'
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Setup queryClient
const queryClient = new QueryClient()

const metadata = {
    name: 'HumanID.fi',
    description: 'The Void Wallet',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://www.humanidfi.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create the modal instance (outside component to be singleton)
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true,
        email: false,
        socials: [],
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-font-family': 'Inter, sans-serif',
        '--w3m-accent': '#FFFFFF',
    }
})

export function Web3ModalProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const { theme } = useTheme();
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as any} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
