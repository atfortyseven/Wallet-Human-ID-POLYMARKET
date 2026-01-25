"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, State } from "wagmi";
import { config } from "@/src/config/wagmi";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/src/context/LanguageContext";

export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
