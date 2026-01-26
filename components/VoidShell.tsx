"use client";

import React, { useState } from "react";
import { Copy, Menu, User, Loader2 } from "lucide-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        <div className="min-h-screen bg-void text-white selection:bg-midgard/30 overflow-x-hidden relative">

            {/* 1. Fondo Dinámico (Static Grid + Ambient Glow) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Sutil */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Luz Ambiental Superior */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-midgard/5 rounded-full blur-[120px]" />
            </div>

            {/* 2. Header Flotante Minimalista */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
                <nav className="flex items-center gap-6 px-6 py-3 rounded-full bg-surface/50 border border-glass-border backdrop-blur-md shadow-2xl">

                    {/* Brand */}
                    <div className="font-bold tracking-tighter text-lg">
                        Human<span className="text-neutral-600">ID</span>.fi
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    {/* Nav Links (Placeholder) */}
                    <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                        <a href="/" className="hover:text-white transition-colors">Feed</a>
                        <a href="/wallet" className="text-white">Wallet</a>
                        <a href="/wallet" className="hover:text-white transition-colors">Gov</a>
                    </div>
                </nav>

                {/* User Controls (Right) */}
                <div className="absolute right-6 top-4 hidden md:flex items-center gap-3">
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
                                className="p-2.5 rounded-full bg-surface border border-glass-border hover:bg-glass-highlight transition-colors text-neutral-400 hover:text-white disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                            </button>
                        )}
                    </IDKitWidget>

                    <button className="p-2.5 rounded-full bg-surface border border-glass-border hover:bg-glass-highlight transition-colors text-neutral-400 hover:text-white">
                        <Menu size={18} />
                    </button>
                </div>
            </header>

            {/* 3. Contenido Principal */}
            <main className="relative z-10 pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
                {children}
            </main>

        </div>
    );
}
