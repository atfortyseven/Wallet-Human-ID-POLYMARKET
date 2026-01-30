"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
    onStart: () => void;
}

export function LandingHero({ onStart }: Props) {
    return (
        <section 
            className="w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 relative"
            aria-label="Welcome to Human Defi"
        >
            <h1 
                className="
                    text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white
                    mb-8 tracking-tighter drop-shadow-lg
                "
                style={{ fontFamily: 'var(--font-inter)' }} // Ensuring consistent font
            >
                Te damos la bienvenida <br className="hidden md:block"/>
                en Human Defi
            </h1>

            <button 
                onClick={onStart}
                className="
                    group relative px-8 py-4 bg-blue-600 rounded-full text-white font-bold text-lg
                    overflow-hidden transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]
                "
                aria-label="Start Registration"
            >
                <span className="relative z-10 flex items-center gap-2">
                    Comenzar
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
        </section>
    );
}
