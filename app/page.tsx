"use client";

import { CreateMarketForm } from '@/components/CreateMarketForm';
import { MarketFeed } from '@/components/MarketFeed';

export default function Home() {
    return (
        <main className="min-h-screen relative bg-slate-900 selection:bg-cyan-500/30 pb-20 overflow-x-hidden">

            {/* 1. Fondo Dinámico Global (Aurora Boreal) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* 2. Contenedor Principal (z-10 para estar sobre el fondo) */}
            <div className="relative z-10 container mx-auto px-4">

                {/* SECCIÓN HERO: Crear Mercado */}
                <section className="min-h-[85vh] flex flex-col items-center justify-center pt-20">
                    <CreateMarketForm />

                    {/* Indicador de scroll (Detalle UX sutil) */}
                    <div className="absolute bottom-10 animate-bounce text-white/30 hidden md:block">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* SECCIÓN FEED: Los 15 Artículos */}
                <section className="py-20 border-t border-white/5 relative">
                    {/* Luz ambiental separadora */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    <MarketFeed />
                </section>

            </div>

        </main>
    );
}
