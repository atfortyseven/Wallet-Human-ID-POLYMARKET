"use client";

import React from 'react';
import LottieCard from '../ui/LottieCard';
import { StackableCarousel } from '../ui/StackableCarousel';

export function FeatureCardsSection() {
    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-20 relative">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest opacity-80">
                Características Principales
            </h3>

            <StackableCarousel itemClassName="w-[85vw] sm:w-[45vw] lg:w-[300px] h-[400px]">
                <LottieCard 
                    lottieSrc="https://lottie.host/0f8c4e3d-9b7a-4f6c-8d2e-1a3b4c5d6e7f/9KJh8G7F6D.lottie"
                    title="Compra y canjea" 
                    subtitle="Soporte nativo para USD y ETH"
                    lottieSize="lg"
                    className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-colors"
                />
                
                <LottieCard 
                    lottieSrc="https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie"
                    title="Human Defi" 
                    subtitle="Rompiendo límites 2027"
                    lottieSize="lg"
                    className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-colors"
                />

                <LottieCard 
                    lottieSrc="https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie"
                    title="Intercambio Rápido" 
                    subtitle="Swaps instantáneos entre cadenas"
                    lottieSize="lg"
                    className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-colors"
                />

                <LottieCard 
                    lottieSrc="https://lottie.host/8e4d2f1c-9bfa-4b77-8db5-3c5f1b2e6a9d/RainCoins.lottie"
                    title="Recompensas" 
                    subtitle="Gana royalties automáticamente"
                    lottieSize="lg"
                    className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-colors"
                />

                <LottieCard 
                    lottieSrc="https://lottie.host/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p/FastLightning.lottie"
                    title="Ultra Rápido" 
                    subtitle="Ejecución instantánea en L2"
                    lottieSize="lg"
                    className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-colors"
                />
            </StackableCarousel>
        </div>
    );
}
