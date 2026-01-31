"use client";

import { motion } from "framer-motion";
import { Lock, Wallet } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import WorldIDButton from "./WorldIDButton";

// Helper for conditional classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function LoginCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "relative w-full max-w-md overflow-hidden",
                "rounded-[32px] border border-white/10",
                "bg-white/[0.03] backdrop-blur-[20px] shadow-2xl",
                "flex flex-col items-center p-8 sm:p-12",
                "transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            )}
        >
            {/* Visual Header */}
            <div className="mb-8 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Lock className="w-5 h-5 text-white/80" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        Polymarket
                    </h1>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm tracking-[0.2em] font-medium uppercase">
                    <Wallet className="w-3 h-3" />
                    <span>Wallet</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full space-y-6">
                <p className="text-center text-white/60 text-sm leading-relaxed">
                    Accede al futuro de los mercados de predicción con tu identidad verificada.
                </p>

                {/* World ID Integration */}
                <div className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative">
                        <WorldIDButton />
                    </div>
                </div>
            </div>

            {/* Footer / Status */}
            <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs text-white/40">Secure Connection Established</span>
                </div>
            </div>
        </motion.div>
    );
}
