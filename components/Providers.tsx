"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { State } from "wagmi";
import { SettingsProvider } from "@/src/context/SettingsContext";
import { AppProvider } from "@/components/AppContext";
import ClientWeb3Provider from '@/components/ClientWeb3Provider';

export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AppProvider>
                <ClientWeb3Provider cookies={null}>
                    <SettingsProvider>
                        <LanguageProvider>
                            {children}
                        </LanguageProvider>
                    </SettingsProvider>
                </ClientWeb3Provider>
            </AppProvider>
        </ThemeProvider>
    );
}
