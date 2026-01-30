'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/0 transition-all duration-300 backdrop-blur-sm">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            {/* HumanID Logo replacing MetaMask Fox but keeping style */}
                            <span className="text-2xl font-extrabold tracking-tight text-white/90 font-sans">
                                HumanID.fi
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <NavLink href="/features">Funciones</NavLink>
                        <NavLink href="/developer">Desarrollador</NavLink>
                        <NavLink href="/support">Soporte</NavLink>
                        <NavLink href="/portfolio">Portfolio</NavLink>
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Language Switcher */}
                        <div className="flex items-center gap-1 text-white/80 cursor-pointer hover:text-white text-sm font-medium">
                            <span>Español</span>
                            <ChevronDown size={14} />
                        </div>

                        {/* CTA BUTTON */}
                        <Link 
                            href="/download"
                            className="bg-[#2c56dd] hover:bg-[#1a3a8a] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105"
                        >
                            DESCARGAR
                        </Link>
                    </div>

                    {/* MOBILE MENU BTN */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white p-2"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl absolute top-20 left-0 w-full h-screen p-6 text-white border-t border-white/10">
                    <div className="flex flex-col space-y-6 text-lg font-medium">
                        <Link href="/features" className="hover:text-blue-400">Funciones</Link>
                        <Link href="/developer" className="hover:text-blue-400">Desarrollador</Link>
                        <Link href="/support" className="hover:text-blue-400">Soporte</Link>
                        <Link href="/portfolio" className="hover:text-blue-400">Portfolio</Link>
                         <Link 
                            href="/download"
                            className="bg-[#2c56dd] text-center text-white px-6 py-3 rounded-full font-bold mt-4"
                        >
                            DESCARGAR
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="text-white/80 hover:text-white font-medium text-sm flex items-center gap-1 transition-colors"
        >
            {children}
            <ChevronDown size={12} className="opacity-50" />
        </Link>
    );
}
