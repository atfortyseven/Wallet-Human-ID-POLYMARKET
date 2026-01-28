"use client";

import { Web3ModalProvider } from "@/config/appkit";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/src/context/SettingsContext";

export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
    return (
        <Web3ModalProvider cookies={null}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <SettingsProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </SettingsProvider>
            </ThemeProvider>
        </Web3ModalProvider>
    );
}
