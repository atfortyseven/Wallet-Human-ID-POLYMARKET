"use client";

import { motion } from "framer-motion";
import { Newspaper, Wallet } from "lucide-react";

type Tab = "NEWS" | "WALLET";

interface GlassDockProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export default function GlassDock({ activeTab, onTabChange }: GlassDockProps) {
    return (
        <div className="flex justify-center my-8 sticky top-24 z-40">
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex p-1.5 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl relative"
            >
                <TabButton
                    isActive={activeTab === "NEWS"}
                    onClick={() => onTabChange("NEWS")}
                    icon={<Newspaper className="w-4 h-4" />}
                    label="MERCADOS & WHALES"
                />

                <div className="w-[1px] bg-white/5 mx-1 my-2" />

                <TabButton
                    isActive={activeTab === "WALLET"}
                    onClick={() => onTabChange("WALLET")}
                    icon={<Wallet className="w-4 h-4" />}
                    label="MI BILLETERA"
                />
            </motion.div>
        </div>
    );
}

function TabButton({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`relative px-6 py-3 rounded-full flex items-center gap-3 transition-colors duration-300 ${isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <span className="relative z-10 flex items-center gap-2 font-sans text-xs font-bold tracking-wider">
                {icon}
                {label}
            </span>
        </button>
    );
}
