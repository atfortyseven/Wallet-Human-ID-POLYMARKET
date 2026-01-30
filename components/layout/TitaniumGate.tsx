
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { AuthModal } from '@/components/auth/AuthModal';

interface TitaniumGateProps {
    children: React.ReactNode;
}

type GateState = 'INTRO' | 'AUTH' | 'APP';

export function TitaniumGate({ children }: TitaniumGateProps) {
    // In a real app, strictMode checking session cookie would happen here.
    // We start at INTRO for the cinematic effect.
    const [state, setState] = useState<GateState>('INTRO');

    return (
        <>
            {/* 1. INTRO SEQUENCE */}
            {state === 'INTRO' && (
                <IntroSequence onComplete={() => setState('AUTH')} />
            )}

            {/* 2. AUTHENTICATION GATE */}
            {(state === 'AUTH' || (state === 'INTRO' && false)) && ( 
                 // Note: We might want Auth to fade in while Intro fades out. 
                 // For now, simple state switch, Intro handles its own exit anim via AnimatePresence if managed internally,
                 // but here we unmount Intro. 
                 // To make it smoother, IntroSequence has an 'exit' prop or handles it. 
                 // Let's rely on IntroSequence's internal exit animation if we keep it mounted, 
                 // BUT since we unmount it, we need a wrapper or just let the next component fade in.
                <AuthModal onAuthenticated={() => setState('APP')} />
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
        </>
    );
}
