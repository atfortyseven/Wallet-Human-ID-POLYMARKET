'use client';

import { useEffect } from 'react';
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit';
import { useWorld } from '@/src/context/WorldContext';
import { ScanFace } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const WorldGate = ({ children }: { children: React.ReactNode }) => {
    const { isHuman, verifyHumanity } = useWorld();
    const APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID!;
    const ACTION = "login";

    useEffect(() => {
        if (!isHuman) {
            console.log("--------------------------------------------------");
            console.log("👁️ WORLD ID DEBUGGER");
            console.log(`🔹 Active App ID: ${APP_ID}`);
            console.log(`🔹 Required Action: ${ACTION}`);
            console.log("--------------------------------------------------");
        }
    }, [isHuman, APP_ID]);

    const handleProof = async (result: ISuccessResult) => {
        const toastId = toast.loading("Verificando prueba criptográfica (ZK-Proof)...");

        try {
            // 1. Enviar prueba al Backend
            const res = await fetch('/api/verify-human', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result),
            });

            const data = await res.json();

            if (!res.ok || !data.verified) {
                throw new Error(data.detail || "Verificación fallida");
            }

            // 2. Éxito: Desbloquear UI
            toast.dismiss(toastId);
            toast.success("✨ Identidad Soberana Verificada");
            verifyHumanity(data);

        } catch (error: any) {
            toast.dismiss(toastId);
            // Mostrar el error específico del backend si existe
            const errorMessage = error.message || "Error desconocido al verificar.";
            toast.error(`Error: ${errorMessage}`);
            console.error("Verification Error details:", error);
        }
    };

    return (
        <>
            {!isHuman && (
                <div className="fixed bottom-10 right-10 z-[100] animate-bounce-slow">
                    <IDKitWidget
                        app_id={APP_ID as `app_${string}`}
                        action={ACTION}
                        onSuccess={handleProof}
                        handleVerify={async (proof: unknown) => {
                            // World ID requiere esta función, pero validamos en onSuccess
                            return;
                        }}
                        verification_level={VerificationLevel.Orb}
                    >
                        {({ open }: { open: () => void }) => (
                            <button
                                onClick={open}
                                className="flex items-center gap-3 bg-white text-black px-6 py-4 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform border-4 border-white/20 backdrop-blur-md"
                            >
                                <ScanFace size={24} className="animate-pulse" />
                                <span>VERIFY HUMANITY</span>
                            </button>
                        )}
                    </IDKitWidget>
                </div>
            )}
            {children}
        </>
    );
};
