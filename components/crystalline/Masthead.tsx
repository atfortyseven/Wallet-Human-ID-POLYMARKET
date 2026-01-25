"use client";

import { motion } from "framer-motion";
import WalletConnect from "@/components/wallet/WalletConnect";

export default function Masthead() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full border-b border-glass-border bg-black/10 backdrop-blur-xl sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">

                {/* Date/Meta - Left */}
                <div className="hidden md:flex flex-col">
                    <span className="text-xs font-serif text-white/40 italic">
                        The Crystalline Ledger
                    </span>
                    <span className="text-[10px] font-sans tracking-widest text-white/30 uppercase mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* BRAND - Center */}
                <h1 className="flex-1 text-center md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto font-serif text-3xl md:text-5xl text-white/90 tracking-[0.05em] font-normal" style={{ fontFamily: 'var(--font-unifraktur)' }}>
                    Polymarket News
                </h1>

                {/* NETWORK - Right */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block h-8 w-[1px] bg-white/10 mx-2" />
                    <WalletConnect />
                </div>
            </div>
        </motion.header>
    );
}
