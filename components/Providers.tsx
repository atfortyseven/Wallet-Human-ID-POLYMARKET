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
        <ClientWeb3Provider cookies={null}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <SettingsProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </SettingsProvider>
            </ThemeProvider>
        </ClientWeb3Provider>
    );
}
