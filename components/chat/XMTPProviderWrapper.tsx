'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Client } from '@xmtp/browser-sdk';

// Context to share XMTP client across components
interface XMTPContextType {
    client: Client<'group'> | null;
    setClient: (client: Client<'group'> | null) => void;
    isReady: boolean;
}

const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

export function useXMTP() {
    const context = useContext(XMTPContext);
    if (!context) {
        throw new Error('useXMTP must be used within XMTPProviderWrapper');
    }
    return context;
}

export default function XMTPProviderWrapper({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<Client<'group'> | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    return (
        <XMTPContext.Provider value={{ client, setClient, isReady }}>
            {children}
        </XMTPContext.Provider>
    );
}
