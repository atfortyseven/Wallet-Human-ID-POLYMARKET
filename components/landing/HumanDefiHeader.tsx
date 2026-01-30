"use client";

import React from 'react';
import { Settings, Globe } from 'lucide-react';
import { useSettings } from '@/src/context/SettingsContext';

export function HumanDefiHeader() {
    const { setIsSettingsOpen } = useSettings();

    return (
        <header 
            className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between"
            role="banner"
        >
            {/* Left: Branding */}
            <div className="flex items-center">
                <button 
                    className="
                        backdrop-blur-md bg-white/10 border border-white/20 
                        text-white font-bold px-6 py-2 rounded-full 
                        hover:bg-white/20 transition-all duration-300
                        shadow-[0_0_15px_rgba(0,0,0,0.2)]
                    "
                    aria-label="Human Defi Home"
                >
                    Human Defi
                </button>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <button 
                    className="
                        flex items-center gap-2
                        backdrop-blur-md bg-black/20 border border-white/10 
                        text-white/90 px-4 py-2 rounded-full 
                        hover:bg-white/10 transition-all text-sm font-medium
                    "
                    aria-label="Select Language"
                >
                    <Globe size={16} />
                    <span>EN</span>
                </button>

                {/* Settings Minimalist */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="
                        p-2 rounded-full 
                        backdrop-blur-md bg-black/20 border border-white/10 
                        text-white/90 hover:bg-white/10 hover:rotate-90 transition-all duration-500
                    "
                    aria-label="Open Settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
