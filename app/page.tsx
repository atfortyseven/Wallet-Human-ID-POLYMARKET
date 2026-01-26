"use client";

import { useWorld } from "@/src/context/WorldContext";
import NewsFeed from "@/components/crystalline/NewsFeed";
import { Leaderboard } from "@/components/crystalline/Leaderboard";
import { motion } from "framer-motion";

export default function Home() {
    const { isHuman } = useWorld();

    return (
        <main className="relative flex min-h-screen w-full flex-col items-center pt-24 pb-12 overflow-hidden">

            {/* 1. BACKGROUND is handled by BackgroundWrapper in Layout */}

            {/* 2. CONTENIDO */}
            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col gap-12">

                {/* News Feed - Visible to Everyone (Ghost Layer) */}
                <div className="w-full animate-fade-in-up">
                    <NewsFeed />
                </div>

                {/* Leaderboard - Only for Humans (Sovereign Layer) */}
                {isHuman && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <Leaderboard />
                    </motion.div>
                )}
            </div>
        </main>
    );
}
