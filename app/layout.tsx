import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers'
import { cookieToInitialState } from "wagmi";
import { config } from "@/src/config/wagmi";
import Web3Provider from "@/src/context/Web3Provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
    variable: "--font-merriweather"
});

import { UnifrakturMaguntia } from "next/font/google";
const unifraktur = UnifrakturMaguntia({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-unifraktur",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://polymarketwallet.up.railway.app'),
    title: "Polymarket Wallet | Secure Identity & Prediction Markets",
    description: "Identity-First Wallet for Prediction Markets",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import GlobalBackground from "@/components/GlobalBackground";

// ... existing imports

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'))

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${merriweather.variable} ${unifraktur.variable} font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Web3Provider initialState={initialState}>
                        <GlobalBackground />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {children}
                        </div>
                    </Web3Provider>
                </ThemeProvider>
            </body>
        </html>
    );
}
