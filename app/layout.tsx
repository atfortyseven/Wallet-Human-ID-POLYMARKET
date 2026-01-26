import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers'
import { cookieToInitialState } from "wagmi";
import { config } from "@/src/config/wagmi";
import { UnifrakturMaguntia } from "next/font/google"; // Font logic moved up
import { Toaster } from "sonner";
import NetworkGuard from "@/components/guards/NetworkGuard";
import Providers from "@/components/Providers";
import BackgroundWrapper from "@/components/layout/BackgroundWrapper";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WorldProvider } from '@/src/context/WorldContext';
import { WorldGate } from '@/components/guards/WorldGate';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
    variable: "--font-merriweather"
});

const unifraktur = UnifrakturMaguntia({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-unifraktur",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.polymarketwallet.com'),
    title: "Polymarket Wallet | Secure Identity & Prediction Markets",
    description: "Identity-First Wallet for Prediction Markets",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'))

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${merriweather.variable} ${unifraktur.variable} font-sans`}>
                <Providers initialState={initialState}>
                    <WorldProvider>
                        <WorldGate>
                            <BackgroundWrapper />
                            <Navbar />
                            <NetworkGuard />
                            <Toaster position="bottom-right" theme="dark" richColors closeButton />
                            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                                <div className="flex-1">
                                    {children}
                                </div>
                                <Footer />
                            </div>
                        </WorldGate>
                    </WorldProvider>
                </Providers>
            </body>
        </html>
    );
}
