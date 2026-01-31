'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Globe, Settings as SettingsIcon, Vote, Wallet, ShieldCheck, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { toast } from "sonner";
import { useAccount } from 'wagmi';
import { useGateState } from '@/components/layout/TitaniumGate';

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Auth Hooks
    const { isAuthenticated, login, isLoading: isAuthLoading } = useAuth();
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();
    const { address } = useAccount();

    const [isVerifying, setIsVerifying] = useState(false);

    // World ID Config
    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_affe7470221b57a8edee20b3ac30c484";
    const action = "login";

    const handleVerify = async (proof: ISuccessResult) => {
        setIsVerifying(true);
        const toastId = toast.loading("Verifying identity...");

        try {
            const res = await fetch("/api/auth/verify-world-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proof, walletAddress: address }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Verification failed");

            toast.dismiss(toastId);
            toast.success("Identity Verified! Governance Unlocked");
            await login(); // Update local auth state
        } catch (error: any) {
            console.error("Verification Error:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "Verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    // Determine if we are in "App Mode" (Logged in)
    const isAppMode = isConnected || isAuthenticated;
    
    // Check gate state to hide header during auth
    const gateState = useGateState();
    
    // Don't render header during INTRO or AUTH states
    if (gateState !== 'APP') {
        return null;
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 transition-all duration-300 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* LOGO */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold tracking-tight text-white/90 font-sans">
                                    HumanID.fi
                                </span>
                            </Link>
                        </div>

                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex space-x-8 items-center">
                            {isAppMode ? (
                                <>
                                    <NavLink href="/" icon={<Globe size={16} />}>Feed</NavLink>
                                    <NavLink href="/wallet" icon={<Wallet size={16} />}>Wallet</NavLink>
                                    <button 
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="text-white/80 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                                    >
                                        <SettingsIcon size={16} />
                                        <span>Settings</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink href="/funciones">Funciones</NavLink>
                                    <NavLink href="/desarrollador">Desarrollador</NavLink>
                                    <NavLink href="/soporte">Soporte</NavLink>
                                </>
                            )}
                        </nav>

                        {/* RIGHT ACTIONS */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* App Mode Controls */}
                            {isAppMode && (
                                <div className="flex items-center gap-3">
                                    {/* World ID Button */}
                                    <IDKitWidget
                                        app_id={app_id}
                                        action={action}
                                        onSuccess={handleVerify}
                                        handleVerify={async (proof: ISuccessResult) => { return; }}
                                        verification_level={VerificationLevel.Device}
                                    >
                                        {({ open }: { open: () => void }) => (
                                            <button
                                                onClick={open}
                                                disabled={isVerifying || isAuthenticated}
                                                className={`p-2.5 rounded-full border transition-all ${
                                                    isAuthenticated
                                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                                title={isAuthenticated ? "Verified Human" : "Verify World ID"}
                                            >
                                                {isVerifying ? <Loader2 size={18} className="animate-spin" /> : 
                                                 isAuthenticated ? <ShieldCheck size={18} /> : <User size={18} />}
                                            </button>
                                        )}
                                    </IDKitWidget>
                                </div>
                            )}

                            {/* Connect Button */}
                            <button 
                                onClick={() => open()}
                                className={`${
                                    isConnected 
                                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                                    : 'bg-[#2c56dd] hover:bg-[#1a3a8a] text-white'
                                } px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 flex items-center gap-2`}
                            >
                                {isConnected ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-blue-400 block" />
                                        {address?.slice(0,6)}...{address?.slice(-4)}
                                    </>
                                ) : "CONNECT"}
                            </button>
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
                            {isAppMode ? (
                                <>
                                    <Link href="/" className="hover:text-blue-400 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Globe size={20} /> Feed
                                    </Link>
                                    <Link href="/wallet" className="hover:text-blue-400 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Wallet size={20} /> Wallet
                                    </Link>
                                    <button 
                                        onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                                        className="hover:text-blue-400 flex items-center gap-2 text-left"
                                    >
                                        <SettingsIcon size={20} /> Settings
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/funciones" className="hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>Funciones</Link>
                                    <Link href="/desarrollador" className="hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>Desarrollador</Link>
                                    <Link href="/soporte" className="hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>Soporte</Link>
                                </>
                            )}
                            
                            <button 
                                onClick={() => open()}
                                className="bg-[#2c56dd] text-center text-white px-6 py-3 rounded-full font-bold mt-4"
                            >
                                {isConnected ? "WALLET SETTINGS" : "CONNECT WALLET"}
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Global Settings Modal */}
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </>
    );
}

function NavLink({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="text-white/80 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
            {icon}
            {children}
        </Link>
    );
}
