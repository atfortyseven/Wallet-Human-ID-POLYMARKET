"use client";

import React from 'react';
import LottieCard from '../ui/LottieCard';
import { TrendingUp } from 'lucide-react';

export function FeatureCardsSection() {
"use client";

import React, { useRef, useState, useEffect } from 'react';
import LottieCard from '../ui/LottieCard';
import { motion, useScroll, useSpring } from 'framer-motion';

export function FeatureCardsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: containerRef });
    const scaleX = useSpring(scrollXProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-20 relative">
            
            {/* Horizontal Scroll Container */}
            <div 
                ref={containerRef}
                className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {/* 1. Buy & Redeem */}
                <div className="min-w-[300px] md:min-w-[400px] snap-center">
                    <LottieCard 
                        lottieSrc="https://lottie.host/0f8c4e3d-9b7a-4f6c-8d2e-1a3b4c5d6e7f/9KJh8G7F6D.lottie"
                        title="Compra y canjea" 
                        subtitle="Soporte nativo para USD y ETH"
                        lottieSize="lg"
                        className="h-full bg-white/5 border-white/10 hover:bg-white/10"
                    />
                </div>

                {/* 2. Secure Accounts */}
                 <div className="min-w-[300px] md:min-w-[400px] snap-center">
                    <LottieCard 
                        lottieSrc="https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie"
                        title="Human Defi" 
                        subtitle="Rompiendo límites 2027"
                        lottieSize="lg"
                        className="h-full bg-white/5 border-white/10 hover:bg-white/10"
                    />
                </div>

                {/* 3. Swap / Exchange */}
                 <div className="min-w-[300px] md:min-w-[400px] snap-center">
                    <LottieCard 
                        lottieSrc="https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie"
                        title="Intercambio Rápido" 
                        subtitle="Swaps instantáneos entre cadenas"
                        lottieSize="lg"
                        className="h-full bg-white/5 border-white/10 hover:bg-white/10"
                    />
                </div>

                {/* 4. Rewards */}
                 <div className="min-w-[300px] md:min-w-[400px] snap-center">
                    <LottieCard 
                        lottieSrc="https://lottie.host/8e4d2f1c-9bfa-4b77-8db5-3c5f1b2e6a9d/RainCoins.lottie"
                        title="Recompensas" 
                        subtitle="Gana royalties automáticamente"
                        lottieSize="lg"
                        className="h-full bg-white/5 border-white/10 hover:bg-white/10"
                    />
                </div>

                 {/* 5. Speed/Bonus */}
                 <div className="min-w-[300px] md:min-w-[400px] snap-center">
                    <LottieCard 
                        lottieSrc="https://lottie.host/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p/FastLightning.lottie"
                        title="Ultra Rápido" 
                        subtitle="Ejecución instantánea en L2"
                        lottieSize="lg"
                        className="h-full bg-white/5 border-white/10 hover:bg-white/10"
                    />
                </div>
            </div>

            {/* Scroll Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden max-w-md mx-auto">
                <motion.div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ scaleX, transformOrigin: "0%" }}
                />
            </div>
            
            <p className="text-center text-white/30 text-xs mt-2 font-mono uppercase tracking-widest">
                Desliza para explorar funciones &rarr;
            </p>
        </div>
    );
}
