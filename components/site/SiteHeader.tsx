'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Settings, Bell, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useGateState } from '@/components/layout/TitaniumGate';
import { AnimatePresence, motion } from 'framer-motion';
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';
import { useLanguage } from '@/src/context/LanguageContext';

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Auth Hooks
    const { isAuthenticated } = useAuth();
    
    // AppKit hooks - may not be available during SSR
    let open: any = null;
    let isConnected = false;
    let address: any = null;
    
    try {
        const appKit = useAppKit();
        open = appKit.open;
        const account = useAppKitAccount();
        isConnected = account.isConnected;
        const wagmiAccount = useAccount();
        address = wagmiAccount.address;
    } catch (e) {
        // AppKit not initialized - this is fine for SSR
    }

    // i18n
    const { t, language, toggleLanguage } = useLanguage();

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
        { name: t('nav.functions'), href: '/funciones' },
        { name: 'VIP MEMBER', href: '/vip', isVIP: true },
        { name: t('nav.developer'), href: '/developer' }, 
        { name: t('nav.human_card'), href: '/wallet' },
        { name: t('nav.support'), href: '/soporte' },
    ];

    return (
        <>
            <header className={`fixed top-6 left-0 right-0 z-[100] transition-all duration-300 pointer-events-none flex justify-center px-4`}>
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`
                        pointer-events-auto
                        flex items-center justify-between 
                        w-full max-w-[1300px] 
                        h-[72px] px-8 rounded-full 
                        bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                        border border-black/5
                        relative
                    `}
                >
                    {/* LOGO */}
                    <div className="w-[180px] lg:w-[250px] flex justify-start items-center gap-1">
                        <Link href="/" className="flex items-center gap-2 group relative z-50 pointer-events-auto">
                            <span className="text-xl font-black tracking-tight text-gray-900 font-sans group-hover:text-black transition-colors">
                                Human DeFi
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="flex-1 hidden xl:flex items-center gap-1 justify-center relative z-50 pointer-events-auto">
                        {navLinks.map((link) => (
                            <div key={link.href} className="relative group">
                                <Link 
                                    href={link.href}
                                    className={`relative z-10 px-5 py-2 text-[14px] font-black transition-all rounded-lg tracking-widest uppercase font-sans whitespace-nowrap flex items-center gap-2 ${
                                        link.isVIP 
                                            ? 'bg-black text-white border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]' 
                                            : 'text-gray-800 hover:text-black hover:bg-gray-100/50'
                                    }`}
                                >
                                    {link.isVIP && <Crown size={16} className="text-[#D4AF37]" />}
                                    {link.isVIP ? "HERRAMIENTA DE PAGO" : link.name}
                                </Link>
                                
                                {/* Stickers for VIP Button */}
                                {link.isVIP && (
                                    <>
                                        {/* Rocket - Left/Bottom */}
                                        <img 
                                            src="/models/5ec47565-dec1-46e9-ab91-67e1e759705e.png" 
                                            alt="Rocket"
                                            className="absolute -left-8 -bottom-6 w-12 h-12 object-contain pointer-events-none z-20 drop-shadow-md transform -rotate-12 group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Star - Right/Top */}
                                        <img 
                                            src="/models/421ed50f-ed5f-45e1-bbdb-575b26e45707.png" 
                                            alt="Star"
                                            className="absolute -right-6 -top-5 w-10 h-10 object-contain pointer-events-none z-20 drop-shadow-md transform rotate-12 group-hover:rotate-45 transition-transform duration-300"
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden md:flex w-[350px] lg:w-[500px] justify-end items-center gap-4 relative z-50 pointer-events-auto">
                        {/* Grouped Icons: Bell, Settings, Language */}
                        <div className="flex items-center gap-4 pr-6 border-r border-gray-200">
                             <div className="scale-110">
                                <NotificationsMenu />
                             </div>
                             
                             <Link href="/settings" className="p-2.5 rounded-full hover:bg-black/5 transition-colors group relative z-10">
                                <Settings size={22} className="text-gray-400 group-hover:text-black transition-colors" />
                             </Link>

                             <button 
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-all group relative z-10"
                                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                            >
                                <Globe size={22} className="text-gray-400 group-hover:text-black transition-colors" />
                                <span className="text-[12px] font-black text-gray-400 group-hover:text-black uppercase tracking-tighter">
                                    {language}
                                </span>
                            </button>
                        </div>

                        {/* CTA / Connect Button */}
                        <button 
                            onClick={() => open()}
                            className="
                                relative z-10
                                bg-black text-white 
                                px-8 py-3 rounded-full 
                                font-black text-[11px] tracking-[0.2em] uppercase
                                hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] 
                                transition-all shadow-lg min-w-[150px]
                            "
                        >
                            {isConnected ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                    {address?.slice(0,6)}...
                                </span>
                            ) : (
                                t('nav.start')
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
                                key={link.href} 
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-[0.15em]"
                            >
                                {link.name}
                            </Link>
                        ))}
                         
                         <div className="flex gap-6 mt-4 items-center">
                             <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-full bg-gray-100 hover:bg-gray-200">
                                <Settings size={28} />
                             </Link>
                             <button onClick={toggleLanguage} className="p-4 px-6 rounded-full bg-gray-100 hover:bg-gray-200 font-black uppercase tracking-widest flex items-center gap-2">
                                <Globe size={22} />
                                {language === 'en' ? 'ES' : 'EN'}
                             </button>
                         </div>

                         <button 
                            onClick={() => { open(); setIsMobileMenuOpen(false); }}
                            className="w-full max-w-xs bg-black text-white px-8 py-4 rounded-full font-black text-lg mt-4 uppercase tracking-[0.2em]"
                        >
                            {isConnected ? t('nav.wallet_settings') : t('nav.start')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
