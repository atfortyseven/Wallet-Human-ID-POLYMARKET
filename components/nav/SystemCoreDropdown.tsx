"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Activity, Fish, Vote, TrendingUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type SystemMode = 'LIVE' | 'WHALES' | 'GOV' | 'YIELD';

const modeConfig = {
    LIVE: { icon: Activity, label: 'Live', color: 'text-emerald-400' },
    WHALES: { icon: Fish, label: 'Whales', color: 'text-violet-400' },
    GOV: { icon: Vote, label: 'Gov', color: 'text-amber-400' },
    YIELD: { icon: TrendingUp, label: 'Yield', color: 'text-cyan-400' }
};

export function SystemCoreDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current mode from URL or default to LIVE
    const currentMode = (searchParams?.get('mode')?.toUpperCase() as SystemMode) || 'LIVE';
    const CurrentIcon = modeConfig[currentMode].icon;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleModeChange = (mode: SystemMode) => {
        router.push(`/?mode=${mode.toLowerCase()}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-white/5"
            >
                <CurrentIcon size={14} className={modeConfig[currentMode].color} />
                <span>System Core</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {(Object.keys(modeConfig) as SystemMode[]).map((mode) => {
                        const Icon = modeConfig[mode].icon;
                        const isActive = mode === currentMode;

                        return (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                className={`w-full px-4 py-2.5 flex items-center gap-2 text-sm transition-colors ${isActive
                                        ? 'bg-white/10 text-[var(--text-primary)] font-medium'
                                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Icon size={14} className={modeConfig[mode].color} />
                                <span>{modeConfig[mode].label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
