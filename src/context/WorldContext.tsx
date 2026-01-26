'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WorldContextType {
    isHuman: boolean;
    verifyHumanity: (result: any) => void;
    nullifierHash: string | null;
    isLoading: boolean; // NEW: Para evitar redirecciones prematuras
}

const WorldContext = createContext<WorldContextType>({
    isHuman: false,
    verifyHumanity: () => { },
    nullifierHash: null,
    isLoading: true,
});

export const useWorld = () => useContext(WorldContext);

export const WorldProvider = ({ children }: { children: ReactNode }) => {
    const [isHuman, setIsHuman] = useState(false);
    const [nullifierHash, setNullifierHash] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Default true

    // Hidratación: Comprobar si ya se verificó antes
    useEffect(() => {
        const savedProof = localStorage.getItem('world-id-proof');
        if (savedProof) {
            setIsHuman(true);
            setNullifierHash(savedProof);
        }
        setIsLoading(false); // Ya terminamos de chequear
    }, []);

    const verifyHumanity = (result: any) => {
        // EN PROD: Aquí enviarías la prueba a tu backend para validarla on-chain o via API
        console.log("Proof received:", result);

        setIsHuman(true);
        setNullifierHash(result.nullifier_hash);
        localStorage.setItem('world-id-proof', result.nullifier_hash);
    };

    return (
        <WorldContext.Provider value={{
            isHuman,
            verifyHumanity,
            nullifierHash,
            isLoading
        }}>
            {children}
        </WorldContext.Provider>
    );
};
