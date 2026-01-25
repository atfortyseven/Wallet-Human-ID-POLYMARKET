"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./Background";
import Masthead from "./Masthead";
import GlassDock from "./GlassDock";
import NewsFeed from "./NewsFeed";
import PolymarketGlassDashboard from "@/components/dashboard/PolymarketGlassDashboard";
import WalletDashboard from "@/components/dashboard/WalletDashboard";
import Leaderboard from "@/components/crystalline/Leaderboard";
import { Trophy } from "lucide-react";

export default function CrystallineDashboard() {
    const [activeTab, setActiveTab] = useState<"NEWS" | "WALLET" | "LEADERBOARD">("NEWS");

    return (
        <main className="min-h-screen text-white font-sans selection:bg-indigo-500/30 bg-transparent">
            {/* Background handled by layout */}
            {/* Masthead handled by layout */}

            <GlassDock activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="relative z-10 px-4 min-h-[calc(100vh-200px)]">
                <AnimatePresence mode="wait">
                    {activeTab === "NEWS" ? (
                        <motion.div
                            key="news"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <NewsFeed />
                        </motion.div>
                    ) : activeTab === "LEADERBOARD" ? (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Leaderboard />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="wallet"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {/* Reuse the verified Dashboard, wrapped in the new aesthetic context if needed */}
                            <div className="max-w-7xl mx-auto">
                                <WalletDashboard />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
