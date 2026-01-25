"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md overflow-hidden group"
            aria-label="Toggle Theme"
        >
            <div className="relative z-10">
                {theme === "dark" ? (
                    <Moon size={20} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                ) : (
                    <Sun size={20} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
                )}
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
