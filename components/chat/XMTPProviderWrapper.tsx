'use client';

import { XMTPProvider } from '@xmtp/react-sdk';
import { useEffect, useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

// Helper to convert Viem WalletClient to Ethers Signer
// XMTP SDK currently works best with Ethers v5/v6 Signers
export function walletClientToSigner(walletClient: any) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.BrowserProvider(transport, network);
    const signer = new ethers.JsonRpcSigner(provider, account.address);
    return signer;
}

export default function XMTPProviderWrapper({ children }: { children: React.ReactNode }) {
    const { data: walletClient } = useWalletClient();
    const [signer, setSigner] = useState<any>(null);

    useEffect(() => {
        if (walletClient) {
            const ethersSigner = walletClientToSigner(walletClient);
            setSigner(ethersSigner);
        }
    }, [walletClient]);

    // If no wallet connected, we can still render children but chat won't work
    // or we can block it. For now, let's allow rendering.

    return (
        <XMTPProvider>
            {children}
        </XMTPProvider>
    );
}
