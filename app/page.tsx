"use client";

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

import EnterpriseDashboard from "@/components/EnterpriseDashboard";
import { toast } from 'sonner';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Production Backend URL
// Production Backend URL (Removed: Using relative path)

export default function Page() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('[Page] Component mounted, fetching dashboard data...');

        // Timeout protection: if loading takes more than 10s, show error
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.error('[Page] Fetch timeout after 10 seconds');
                setError('Connection timeout - using offline mode');
                setIsLoading(false);
            }
        }, 10000);

        async function fetchData() {
            try {
                console.log('[Page] Fetching from /api/dashboard...');
                const res = await fetch('/api/dashboard');

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }

                const jsonData = await res.json();
                console.log('[Page] Dashboard data fetched successfully:', jsonData);
                setData(jsonData);
                setError(null);
            } catch (error: any) {
                console.error("[Page] Dashboard fetch error:", error);
                const errorMsg = error?.message || 'Failed to fetch data';
                setError(errorMsg);
                // Still allow page to render with fallback data
                toast.error("Using offline mode", { description: "Could not connect to Vault Network." });
            } finally {
                clearTimeout(timeoutId);
                setIsLoading(false);
                console.log('[Page] Loading complete');
            }
        }

        fetchData();

        return () => clearTimeout(timeoutId);
    }, []);

    // Loading state with timeout protection
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <div className="animate-pulse text-[#00f2ea] font-mono text-sm">INITIALIZING VAULT LINK...</div>
                <div className="text-zinc-600 font-mono text-xs">
                    {typeof window !== 'undefined' ? 'Client Ready' : 'Server Rendering'}
                </div>
            </div>
        );
    }

    // Critical error state - show error but allow retry
    if (error && !data) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-950/20 border border-red-500/30 rounded-xl p-8">
                    <div className="flex items-center gap-4 mb-4 text-red-500">
                        <AlertCircle size={32} />
                        <h1 className="text-xl font-bold">CONNECTION ERROR</h1>
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">{error}</p>
                    <p className="text-xs text-zinc-500 mb-6">
                        The application will continue with limited functionality.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                        RETRY CONNECTION
                    </button>
                </div>
            </div>
        );
    }

    // Success: render dashboard with data (or fallback)
    console.log('[Page] Rendering EnterpriseDashboard with data:', data ? 'loaded' : 'fallback');
    return (
        <EnterpriseDashboard
            initialData={data}
        />
    );
}
