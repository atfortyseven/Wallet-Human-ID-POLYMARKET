"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorld } from "@/src/context/WorldContext";
import { Loader2 } from "lucide-react";

export default function VerificationGuard({ children }: { children: React.ReactNode }) {
    const { isHuman, isLoading } = useWorld();
    const router = useRouter();

    useEffect(() => {
        // Si ya cargó y NO es humano, patada al home
        if (!isLoading && !isHuman) {
            router.replace("/");
        }
    }, [isHuman, isLoading, router]);

    // Mientras carga, o si no es humano (y está redirigiendo), mostramos un loader o null
    if (isLoading || !isHuman) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-sm font-light tracking-[0.2em] animate-pulse">
                    VERIFYING SOVEREIGNTY...
                </p>
            </div>
        );
    }

    // Si es humano, adelante
    return <>{children}</>;
}
