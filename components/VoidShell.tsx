"use client";

import React, { useState } from "react";
import { Copy, Menu, User, Loader2 } from "lucide-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SettingsMenu from "./SettingsMenu";

export default function VoidShell({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // World ID Config
    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_affe7470221b57a8edee20b3ac30c484"; // Fallback to ensure it works if env missing
    const action = "login";

    const handleVerify = async (proof: ISuccessResult) => {
        setIsLoading(true);
        const toastId = toast.loading("Verifying identity...");

        try {
            const res = await fetch("/api/auth/verify-world-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proof,
                    walletAddress: address,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Verification failed");

            toast.dismiss(toastId);
            toast.success("Identity Verified!");

            // Redirect to Wallet as requested
            router.push("/wallet");

        } catch (error: any) {
            console.error("Login Error:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "Failed to verify");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-midgard/30 overflow-x-hidden relative transition-colors duration-300">

            {/* 1. Fondo Dinámico (Static Grid + Ambient Glow) */}
            <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-300`}>
                {/* Grid Sutil */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Luz Ambiental Superior */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-midgard/5 rounded-full blur-[120px]" />
            </div>

            {/* 2. Header Flotante Minimalista */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
                <nav className="flex items-center gap-6 px-6 py-3 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md shadow-2xl transition-colors duration-300">

                    {/* Brand */}
                    <div className="font-bold tracking-tighter text-lg text-[var(--text-primary)]">
                        Human<span className="text-[var(--text-secondary)]">ID</span>.fi
                    </div>

                    <div className="h-4 w-[1px] bg-[var(--border-main)]" />

                    {/* Nav Links (Placeholder) */}
                    <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-secondary)]">
                        <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Feed</a>
                        <a href="/wallet" className="hover:text-[var(--text-primary)] transition-colors">Wallet</a>
                        <a href="/voting" className="hover:text-[#00f2ea] transition-colors">Voting Hub</a>
                    </div>
                </nav>

                {/* User Controls (Right) */}
                <div className="absolute right-6 top-4 hidden md:flex items-center gap-3">
                    {/* IDENTITY STATUS BADGE (NEW) */}
                    <div className="hidden lg:flex items-center gap-3 mr-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-widest text-[#00f2ea]">Identity Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-neutral-300">Unverified Tier 0</span>
                            </div>
                        </div>
                    </div>

                    {/* IDKit Widget - Wraps the User Button for Verification */}
                    <IDKitWidget
                        app_id={app_id}
                        action={action}
                        onSuccess={handleVerify}
                        handleVerify={async (proof: ISuccessResult) => { return; }}
                        verification_level={VerificationLevel.Orb}
                    >
                        {({ open }: { open: () => void }) => (
                            <button
                                onClick={open}
                                disabled={isLoading}
                                className="group relative p-2.5 rounded-full bg-surface border border-glass-border hover:bg-glass-highlight transition-colors text-neutral-400 hover:text-white disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <User size={18} />
                                        {/* Notification Dot */}
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#09090b] rounded-full" />
                                    </>
                                )}
                            </button>
                        )}
                    </IDKitWidget>

                    <SettingsMenu />
                </div>
            </header>

            {/* 3. Contenido Principal */}
            <main className="relative z-10 pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
                {children}
            </main>

        </div>
    );
}
