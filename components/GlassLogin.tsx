"use client";

import { toast } from "sonner";

import { motion } from "framer-motion";
import { ShieldCheck, Wallet } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WorldIDButton from "./WorldIDButton";

export default function GlassLogin() {
    const [isDiving, setIsDiving] = useState(false);
    const router = useRouter();

    const handleSuccess = async (proof: any) => {
        try {
            // 1. Send proof to Backend for Verification & Sybil Check
            toast.loading("Verifying Identity...");

            const res = await fetch("/api/auth/verify-world-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proof),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Verification failed");
            }

            // 2. Success Feedback
            toast.dismiss();
            toast.success("Identity Verified: Human confirmed");

            // 3. Trigger Animation & Navigation
            setIsDiving(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2800);

        } catch (error: any) {
            console.error(error);
            toast.dismiss();
            toast.error(error.message || "Verification Failed");
        }
    };

    const diveVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
        },
        diving: {
            scale: 10,      // Massive scale up to simulate entering "into" the card
            opacity: 0,     // Fade out as we get too close
            filter: "blur(10px)",
            transition: { duration: 2.5, ease: "easeInOut" } as const
        }
    };

    return (
        <motion.div
            variants={diveVariants}
            initial="initial"
            animate={isDiving ? "diving" : "animate"}
            className="relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-gray-900/30 backdrop-blur-2xl shadow-2xl ring-1 ring-white/5"
        >
            {/* Efecto de brillo superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent blur-sm" />

            <div className="flex flex-col items-center p-8 pt-10">

                {/* Icono Header */}
                <div className="mb-6 rounded-full bg-white/5 p-3 ring-1 ring-white/10 shadow-lg backdrop-blur-md">
                    <ShieldCheck className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>

                {/* Títulos */}
                <div className="text-center space-y-1 mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Polymarket
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-[0.2em] text-gray-400 uppercase">
                        <Wallet className="w-3 h-3" />
                        <span>Wallet</span>
                    </div>
                </div>

                {/* Separador Sutil */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Tu Botón de World ID */}
                <div className="w-full">
                    <WorldIDButton onVerificationSuccess={handleSuccess} />
                </div>

                {/* Footer pequeño */}
                <p className="mt-6 text-[10px] text-gray-500 text-center font-medium">
                    Secured by World ID & Blockchain
                </p>
            </div>
        </motion.div>
    );
}
