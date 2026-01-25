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

export const metadata: Metadata = {
    metadataBase: new URL('https://polymarketwallet.up.railway.app'),
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
        <html lang="en">
            <body className={`${inter.variable} ${merriweather.variable} font-sans`}>
                <Web3Provider initialState={initialState}>
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}
