"use client";

import { Web3ModalProvider } from "@/config/appkit";
import { ReactNode } from "react";

export default function ClientWeb3Provider({ children, cookies }: { children: ReactNode, cookies: string | null }) {
    return (
        <Web3ModalProvider cookies={cookies}>
            {children}
        </Web3ModalProvider>
    );
}
