import type { Metadata } from 'next';
// Force rebuild
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { AppProvider } from '@/components/AppContext';
import { WorldProvider } from '@/src/context/WorldContext';
import { Toaster } from 'sonner';
import VoidShell from '@/components/VoidShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'HumanID.fi | The Void Wallet',
    description: 'Sybil-resistant financial engine for Polymarket',
};

import BackgroundVideo from '@/components/layout/BackgroundVideo';
import { BootSequence } from '@/components/layout/BootSequence';
import { Footer } from '@/components/layout/Footer';

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
            <body className="bg-transparent text-white relative min-h-screen">
                <BootSequence />
                <BackgroundVideo />
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
