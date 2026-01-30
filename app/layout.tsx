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
// import { BootSequence } from '@/components/layout/BootSequence';
import { Footer } from '@/components/layout/Footer';
import { SiteHeader } from '@/components/site/SiteHeader'; // Added import for SiteHeader
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

import IdentityCore from '@/components/3d/IdentityCore'; // [NEW] Global 3D Background - Hoisted for resilience

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
            <head>
                {/* CRITICAL: Inline error capture BEFORE any modules load */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </head>
            <body className="relative min-h-screen">
                {/* Immediate loading indicator - shows BEFORE React loads */}
                <noscript>
                    <div style={{ background: '#000', color: '#f00', padding: '40px', textAlign: 'center', fontFamily: 'monospace' }}>
                        <h1>⚠️ JavaScript Required</h1>
                        <p>This application requires JavaScript to run. Please enable JavaScript in your browser.</p>
                    </div>
                </noscript>

                {/* VISUAL RESILIENCE: 3D Background exists OUTSIDE the Error Boundary */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    {/* <IdentityCore mode="LIVE" /> */}
                </div>

                 {/* Official Header Layer */}
                <SiteHeader />

                <Providers>
                    {children}
                </Providers>

                {/* VISUAL RESILIENCE: Global Error Boundary is transparent */}
                <GlobalErrorBoundary />
                
                <Toaster />
            </body>
        </html>
    );
}
