"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./Background";
import Masthead from "./Masthead";
import GlassDock from "./GlassDock";
import NewsFeed from "./NewsFeed";
import PolymarketGlassDashboard from "@/components/dashboard/PolymarketGlassDashboard";

export default function CrystallineDashboard() {
    const [activeTab, setActiveTab] = useState<"NEWS" | "WALLET">("NEWS");

    return (
        <main className="min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Background />
            <Masthead />

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
                                <PolymarketGlassDashboard embedded={true} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
