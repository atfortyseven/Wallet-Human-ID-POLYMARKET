"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { State } from "wagmi";
import { SettingsProvider } from "@/src/context/SettingsContext";
import dynamic from 'next/dynamic';

const ClientWeb3Provider = dynamic(() => import('@/components/ClientWeb3Provider'), {
    ssr: false
});

export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <ClientWeb3Provider cookies={null}>
                <SettingsProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </SettingsProvider>
            </ClientWeb3Provider>
        </ThemeProvider>
    );
}
