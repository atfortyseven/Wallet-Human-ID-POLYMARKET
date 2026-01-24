import { useAccount, useSignMessage, useReadContract } from "wagmi";
import { useState, useEffect } from "react";

// Placeholder for Polymarket/Gnosis Proxy Factory on Polygon
const PROXY_FACTORY_ADDRESS = "0xa584D285F5D0992300D775D4E680E7B28E8C0468";

// Using JSON ABI instead of parseAbi to avoid potential runtime parsing issues in edge environments
const FACTORY_ABI = [
    {
        inputs: [{ name: "_user", type: "address" }],
        name: "isInstantiation",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

export function usePolymarketSession() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [isProxyEnabled, setIsProxyEnabled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(false);

    // 1. Check if user has a Proxy Wallet deployed
    const { data: hasProxy, isLoading: isProxyCheckLoading } = useReadContract({
        address: PROXY_FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "isInstantiation",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address // Only run if address is defined
        }
    });

    useEffect(() => {
        if (hasProxy) {
            setIsProxyEnabled(Boolean(hasProxy));
        }
    }, [hasProxy]);

    // 2. Login / SIWE (Simulated for API Auth)
    const login = async () => {
        if (!address) return;
        setSessionLoading(true);
        try {
            const message = `Log in to Polymarket Clone\nTime: ${Date.now()}`;
            const signature = await signMessageAsync({ message });

            // Setup API Headers here (Dummy)
            if (typeof window !== 'undefined') {
                localStorage.setItem("polymarket_auth", signature);
            }
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setSessionLoading(false);
        }
    };

    return {
        address,
        isConnected,
        isProxyEnabled,
        isAuthenticated,
        // Add null checks for loading states to prevent hydration mismatches if possible
        isSessionLoading: sessionLoading || (!!address && isProxyCheckLoading),
        login
    };
}
