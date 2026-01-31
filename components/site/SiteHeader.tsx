'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useGateState } from '@/components/layout/TitaniumGate';
import { AnimatePresence, motion } from 'framer-motion';
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Auth Hooks
    const { isAuthenticated } = useAuth();
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();
    const { address } = useAccount();

    const { state } = useGateState();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Don't render header during INTRO or AUTH states
    if (state !== 'APP') {
        return null;
    }

    const navLinks = [
        { name: 'Funciones', href: '/funciones' },
        { name: 'Desarrollador', href: '/developer' }, 
        { name: 'Tarjeta Human', href: '/wallet' }, // Mapped to Wallet
        { name: 'Human USD', href: '/tokenomics' }, // Mapped to Tokenomics
        { name: 'Soporte', href: '/soporte' },
    ];

    return (
        <>
            <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 pointer-events-none flex justify-center px-4`}>
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`
                        pointer-events-auto
                        flex items-center justify-between 
                        w-full max-w-[1240px] 
                        h-[72px] px-8 rounded-full 
                        bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                        border border-black/5
                        relative
                    `}
                >
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold tracking-tight text-gray-900 font-sans group-hover:text-black transition-colors">
                                Human DeFi
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="px-5 py-2 text-[15px] font-medium text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100/50 whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Notifications */}
                        <div className="border-r border-gray-200 pr-4 mr-2 flex items-center gap-2">
                             <NotificationsMenu />
                             <Link href="/settings" className="p-2 rounded-full hover:bg-black/5 transition-colors group">
                                <Settings size={20} className="text-gray-400 group-hover:text-black transition-colors" />
                             </Link>
                        </div>

                        {/* Language/Globe Icon */}
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Globe size={20} strokeWidth={1.5} />
                        </button>

                        {/* CTA / Connect Button */}
                        <button 
                            onClick={() => open()}
                            className="
                                bg-black text-white 
                                px-6 py-2.5 rounded-full 
                                font-bold text-sm tracking-wide 
                                hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] 
                                transition-all shadow-lg min-w-[140px]
                            "
                        >
                            {isConnected ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    {address?.slice(0,6)}...
                                </span>
                            ) : (
                                "COMENZAR"
                            )}
                        </button>
                    </div>

                    {/* MOBILE MENU BTN */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-32 px-6 pb-6 md:hidden flex flex-col items-center gap-8"
                    >
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                         <div className="flex gap-6 mt-4">
                             <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-full bg-gray-100 hover:bg-gray-200">
                                <Settings size={28} />
                             </Link>
                         </div>
                         <button 
                            onClick={() => { open(); setIsMobileMenuOpen(false); }}
                            className="w-full max-w-xs bg-black text-white px-8 py-4 rounded-full font-bold text-lg mt-4"
                        >
                            {isConnected ? "WALLET SETTINGS" : "COMENZAR"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
