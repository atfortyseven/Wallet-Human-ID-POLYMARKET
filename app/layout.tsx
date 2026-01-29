// CRITICAL: Polyfills MUST load first to fix production black screen
import '@/components/polyfills';

import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { AppProvider } from '@/components/AppContext';
import { WorldProvider } from '@/src/context/WorldContext';
import { Toaster } from 'sonner';
import VoidShell from '@/components/VoidShell';
import BackgroundVideo from '@/components/layout/BackgroundVideo';
import { BootSequence } from '@/components/layout/BootSequence';
import { Footer } from '@/components/layout/Footer';
import { GeoBlocker } from '@/components/logic/GeoBlocker';
import { TermsGate } from '@/components/compliance/TermsGate';
import { BaseGasWidget } from '@/components/compliance/BaseGasWidget';
import RegisterSW from '@/components/pwa/RegisterSW';
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { ErrorLogger } from '@/components/ErrorLogger';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {


    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#000000',
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.humanidfi.com'),
    title: 'HumanID.fi | The Void Wallet',
    description: 'Sybil-resistant financial engine for Polymarket. Built on Base Sepolia.',
    icons: {
        icon: [
            { url: '/logo.png', sizes: 'any' },
            { url: '/assets/icon-16.png', sizes: '16x16', type: 'image/png' },
            { url: '/assets/icon-48.png', sizes: '48x48', type: 'image/png' },
            { url: '/assets/icon-128.png', sizes: '128x128', type: 'image/png' },
        ],
        apple: [
            { url: '/assets/icon-128.png', sizes: '128x128', type: 'image/png' },
        ],
    },
    openGraph: {
        title: 'HumanID.fi | Sovereign Intelligence',
        description: 'Identity-First Decentralized Finance. Verify your humanity, access the global intel feed.',
        url: 'https://www.humanidfi.com',
        siteName: 'HumanID.fi',
        images: [
            {
                url: '/og-void.jpg', // Relative path now works with metadataBase
                width: 1200,
                height: 630,
                alt: 'HumanID Upgrade',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HumanID.fi | The Void Wallet',
        description: 'Sybil-resistant financial engine for Polymarket.',
        creator: '@HumanID_fi',
        images: ['/og-void.jpg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
            <body className="relative min-h-screen">
                <Providers>
                    <GlobalErrorBoundary>
                        <ErrorLogger />
                        <RegisterSW />
                        <TermsGate />
                        <GeoBlocker />
                        <BootSequence />
                        <BackgroundVideo />
                        <BaseGasWidget />
                        <AppProvider>
                            <WorldProvider>
                                <VoidShell>
                                    {children}
                                    <Footer />
                                </VoidShell>
                                <Toaster richColors theme="dark" />
                            </WorldProvider>
                        </AppProvider>
                    </GlobalErrorBoundary>
                </Providers>
            </body>
        </html>
    );
}
