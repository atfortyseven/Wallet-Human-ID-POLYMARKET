"use client";

import React, { useState } from "react";
import { Copy, Menu, User, Loader2, ShieldCheck, AlertCircle, Settings as SettingsIcon, Vote } from "lucide-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SettingsModal } from "@/components/ui/SettingsModal";
import { useAuth } from "@/hooks/useAuth";
import dynamic from 'next/dynamic';
const GhostMessenger = dynamic(() => import('./chat/GhostMessenger').then(mod => mod.GhostMessenger), { ssr: false });
import XMTPProviderWrapper from './chat/XMTPProviderWrapper'; // [NEW] Phase 4
import IdentityCore from './3d/IdentityCore'; // [NEW] Global 3D Background

export default function VoidShell({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, login } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // ... world id config ...
    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_affe7470221b57a8edee20b3ac30c484";
    const action = "login";

    const handleVerify = async (proof: ISuccessResult) => {
        setIsLoading(true);
        const toastId = toast.loading("Verifying identity...");

        console.log("🔐 World ID Verification Started", {
            app_id,
            action,
            hasProof: !!proof,
            nullifier: proof.nullifier_hash
        });

        try {
            const res = await fetch("/api/auth/verify-world-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proof, walletAddress: address }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Verification failed:", data);
                throw new Error(data.error || "Verification failed");
            }

            console.log("✅ Verification successful!", data);
            toast.dismiss(toastId);
            toast.success("¡Identidad Verificada! Governance desbloqueada 🎉");

            // Trigger auth refresh
            await login();

            // Redirect to wallet
            router.push("/wallet");
        } catch (error: any) {
            console.error("❌ Login Error:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "No se pudo verificar tu identidad");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <XMTPProviderWrapper>
            <div className="min-h-screen bg-[#0D0D12] text-[var(--text-primary)] selection:bg-midgard/30 overflow-x-hidden relative transition-colors duration-300">

                {/* --- GLOBAL 3D WALLPAPER --- */}
                <div className="fixed inset-0 z-0">
                    <IdentityCore />
                </div>

                {/* Overlay Gradient for Text Readability */}
                <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-transparent pointer-events-none" />

                {/* 2. Header Flotante Minimalista */}
                <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
                    <nav className="flex items-center gap-6 px-6 py-3 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md shadow-2xl transition-colors duration-300">

                        {/* Brand */}
                        <div className="font-bold tracking-tighter text-lg text-[var(--text-primary)]">
                            Human<span className="text-[var(--text-secondary)]">ID</span>.fi
                        </div>

                        <div className="h-4 w-[1px] bg-[var(--border-main)]" />

                        {/* Nav Links */}
                        <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-secondary)]">
                            <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Feed</a>
                            <a href="/wallet" className="hover:text-[var(--text-primary)] transition-colors">Wallet</a>
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Vote size={14} />
                                <span>Governance</span>
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                            >
                                <SettingsIcon size={14} />
                                <span>Settings</span>
                            </button>
                        </div>
                    </nav>

                    {/* User Controls (Right) */}
                    <div className="absolute right-6 top-4 hidden md:flex items-center gap-3">

                        {/* IDKit Widget - Wraps the User Button for Verification */}
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
                                    disabled={isLoading || isAuthenticated}
                                    className={`group relative p-2.5 rounded-full border transition-colors ${isAuthenticated
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20'
                                        : 'bg-surface border-glass-border hover:bg-glass-highlight text-neutral-400 hover:text-white'
                                        } disabled:opacity-50`}
                                >
                                    {isLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : isAuthenticated ? (
                                        <ShieldCheck size={18} />
                                    ) : (
                                        <>
                                            <User size={18} />
                                            {/* Notification Dot for Unverified */}
                                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#09090b] rounded-full" />
                                        </>
                                    )}
                                </button>
                            )}
                        </IDKitWidget>
                    </div>
                </header>

                {/* 3. Contenido Principal */}
                <main className="relative z-10 pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                {/* Global Chat Module */}
                <GhostMessenger />

                {/* Settings Modal */}
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            </div>
        </XMTPProviderWrapper>
    );
}
