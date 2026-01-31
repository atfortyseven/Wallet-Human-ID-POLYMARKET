
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { AuthModal } from '@/components/auth/AuthModal';
import { createContext, useContext } from 'react';

type GateState = 'INTRO' | 'AUTH' | 'APP';

const GateStateContext = createContext<GateState>('INTRO');
export const useGateState = () => useContext(GateStateContext);

interface TitaniumGateProps {
    children: React.ReactNode;
}

export function TitaniumGate({ children }: TitaniumGateProps) {
    // Always start at INTRO for the full cinematic experience
    const [state, setState] = useState<GateState>('INTRO');

    return (
        <GateStateContext.Provider value={state}>
            {/* 1. INTRO SEQUENCE */}
            {state === 'INTRO' && (
                <IntroSequence onComplete={() => setState('AUTH')} />
            )}

            {/* 2. AUTHENTICATION GATE */}
            {state === 'AUTH' && (
                <>
                    <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
                        {/* Renamed check to ensure import validity (it's imported as FluidBeigeBackground in page.tsx, likely need to move or import here if not passed). 
                            Actually, TitaniumGate wraps page content. Page.tsx has the background inside APP state.
                            TitaniumGate needs its own background for the AUTH state if page.tsx one is hidden.
                            Let's assume FluidBeigeBackground is available or we use a simple beige div.
                        */}
                        <div className="absolute inset-0 bg-[#F5F5DC]" /> 
                    </div>
                    <AuthModal onAuthenticated={() => setState('APP')} />
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
                    {children}
                </motion.div>
            )}
        </GateStateContext.Provider>
    );
}
