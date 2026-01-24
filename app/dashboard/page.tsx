"use client";

import { usePolymarketSession } from "@/hooks/usePolymarketSession";
import BalanceCard from "@/components/dashboard/BalanceCard";
import PopularMarkets from "@/components/dashboard/PopularMarkets";
import TradeForm from "@/components/trading/TradeForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { isConnected, isSessionLoading, login, isAuthenticated } = usePolymarketSession();
    const router = useRouter();

    // Redirect if not valid (Simplified for demo, usually middleware handles this)
    useEffect(() => {
        // If you want to force login:
        // if (!isConnected) login(); 
    }, [isConnected]);

    if (isSessionLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-4 pb-24 md:p-8 space-y-8">
            {/* Top Bar */}
            <header className="flex justify-between items-center max-w-5xl mx-auto w-full">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-400 font-mono">
                        {isAuthenticated ? "API Active" : "Read Only"}
                    </span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col - Balance & Portfolio */}
                <div className="md:col-span-1 space-y-6">
                    <BalanceCard />
                    {/* Could add Recent Activity here */}
                </div>

                {/* Right Col - Markets */}
                <div className="md:col-span-2 space-y-6">
                    <TradeForm marketSlug="demo-market" tokenIdYes="1" tokenIdNo="2" />
                    <PopularMarkets />
                </div>
            </div>
        </main>
    );
}
