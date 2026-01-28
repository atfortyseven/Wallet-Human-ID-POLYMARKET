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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {


    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#000000',
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://humanid.fi'),
    title: 'HumanID.fi | The Void Wallet',
    description: 'Sybil-resistant financial engine for Polymarket. Built on Base Sepolia.',
    openGraph: {
        title: 'HumanID.fi | Sovereign Intelligence',
        description: 'Identity-First Decentralized Finance. Verify your humanity, access the global intel feed.',
        url: 'https://humanid.fi',
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
                <RegisterSW />
                <TermsGate />
                <GeoBlocker />
                <BootSequence />
                <BackgroundVideo />
                <BaseGasWidget />
                <Providers>
                    <AppProvider>
                        <WorldProvider>
                            <VoidShell>
                                {children}
                                <Footer />
                            </VoidShell>
                            <Toaster richColors theme="dark" />
                        </WorldProvider>
                    </AppProvider>
                </Providers>
            </body>
        </html>
    );
}
