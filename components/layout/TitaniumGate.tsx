
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { AuthModal } from '@/components/auth/AuthModal';
import { SafeErrorBoundary } from '@/components/ui/SafeErrorBoundary';
import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

type GateState = 'INTRO' | 'AUTH' | 'APP';

interface GateContextType {
    state: GateState;
    hasPlayedIntro: boolean;
}

const GateStateContext = createContext<GateContextType>({ state: 'INTRO', hasPlayedIntro: false });
export const useGateState = () => useContext(GateStateContext);

interface TitaniumGateProps {
    children: React.ReactNode;
}

export function TitaniumGate({ children }: TitaniumGateProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const [state, setState] = useState<GateState>('INTRO');
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

    useEffect(() => {
        // Si el usuario ya está autenticado (tiene sesión activa), saltar directamente a APP
        // La animación SOLO se muestra la primera vez antes del primer login
        if (!isLoading) {
            if (isAuthenticated) {
                // Usuario tiene sesión activa = Saltar intro y auth
                setState('APP');
                setHasPlayedIntro(true);
            } else {
                // Usuario nuevo o sin sesión = Mostrar intro
                setState('INTRO');
            }
        }
    }, [isAuthenticated, isLoading]);

    const handleIntroComplete = () => {
        setHasPlayedIntro(true);
        setState('AUTH');
    };

    // Mientras se verifica la sesión, mostrar un simple loader
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
        );
    }

    return (
        <GateStateContext.Provider value={{ state, hasPlayedIntro }}>
            {/* 1. INTRO SEQUENCE - Solo si NO está autenticado */}
            {state === 'INTRO' && (
                <IntroSequence onComplete={handleIntroComplete} />
            )}

            {/* 2. AUTHENTICATION GATE */}
            {state === 'AUTH' && (
                <>
                    <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
                        <div className="absolute inset-0 bg-[#F5F5DC]" /> 
                    </div>
                    <SafeErrorBoundary fallback={<div className="p-10 text-center text-red-600">Auth Error. Please Refresh.</div>}>
                        <AuthModal onAuthenticated={() => setState('APP')} />
                    </SafeErrorBoundary>
                </>
            )}

            {/* 3. THE APPLICATION */}
            {state === 'APP' && (
                <motion.div 
                    key="app"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <SafeErrorBoundary>
                        {children}
                    </SafeErrorBoundary>
                </motion.div>
            )}
        </GateStateContext.Provider>
    );
}
