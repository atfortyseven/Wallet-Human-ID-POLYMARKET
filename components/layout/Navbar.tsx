"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Home, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';
import { useWorld } from '@/src/context/WorldContext';
import { WalletControl } from '@/components/crystalline/WalletControl';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const { isHuman } = useWorld();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Conditional Menu for Verified vs Unverified
    const navLinks = isHuman
        ? [
            { href: '/', label: t('nav.home'), icon: <Home size={18} /> },
            { href: '/favorites', label: t('nav.fav'), icon: <Heart size={18} /> },
            { href: '/dashboard', label: t('nav.leaderboard'), icon: <BarChart2 size={18} /> },
            // Add any verified-only links here if needed in future
        ]
        : [
            { href: '/', label: t('nav.home'), icon: <Home size={18} /> },
            { href: '/dashboard', label: t('nav.leaderboard'), icon: <BarChart2 size={18} /> },
        ];

    return (
        <nav
            className={`
                sticky top-0 z-50 w-full border-b transition-all duration-1000 ease-in-out
                bg-[#0D0D12]/80 dark:bg-[#0D0D12]/80 bg-white/80 backdrop-blur-xl border-white/5 opacity-100 translate-y-0
            `}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* LOGO (Left) */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-serif text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Polymarket<span className="text-blue-500 font-sans">News</span>
                    </Link>
                </div>

                {/* DESKTOP LINKS (Center) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-2 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP CONTROLS (Right) */}
                <div className="hidden md:flex items-center gap-3">
                    <LanguageSelector />
                    <ThemeToggle />
                    <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />
                    <WalletControl />
                </div>

                {/* MOBILE CONTROLS (Right) */}
                <div className="flex md:hidden items-center gap-3">
                    <WalletControl />
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-200"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            {/* Mobile Links */}
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                                    >
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            {link.icon}
                                        </div>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-[1px] w-full bg-black/10 dark:bg-white/10" />

                            {/* Mobile Settings */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Settings</span>
                                <div className="flex gap-4">
                                    <LanguageSelector />
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
