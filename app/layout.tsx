import type { Metadata } from 'next';
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

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
            <body className="bg-transparent text-white relative min-h-screen">
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
