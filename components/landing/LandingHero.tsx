"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollLottie } from '@/components/ui/ScrollLottie';

interface Props {
    onStart: () => void;
}

export function LandingHero({ onStart }: Props) {
    const [isVideoEnded, setIsVideoEnded] = React.useState(false);

    return (
        <section 
            className="w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
            aria-label="Welcome to Human Defi"
        >
            {/* INTRO VIDEO LAYER */}
            <div 
                className={`
                    absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out
                    ${isVideoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
            >
                <video 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    onEnded={() => setIsVideoEnded(true)}
                >
                    <source src="/models/kanagawa-wave.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay for Text Readability during Video */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* PREMIUM SCROLL LOTTIE BACKGROUND (Appears after video ends) */}
            <div 
                className={`
                    absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none
                    ${isVideoEnded ? 'opacity-60' : 'opacity-0'}
                `}
            >
                <ScrollLottie
                     src="https://lottie.host/98c5806c-843e-4363-8a9d-59d4c153724c/Example3DNetwork.lottie"
                     className="w-full h-full"
                     speed={1.2}
                />
            </div>

            {/* CONTENT LAYER (Title always visible, Button appears after) */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 
                    className="
                        text-6xl md:text-8xl lg:text-[9rem] font-black text-transparent bg-clip-text 
                        bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900
                        mb-8 tracking-tighter drop-shadow-2xl uppercase leading-[0.9]
                        transition-all duration-1000
                    "
                    style={{ 
                        fontFamily: 'var(--font-inter)',
                        // During video, make text white/light for contrast, then switch to dark indigo
                        backgroundImage: isVideoEnded 
                            ? 'linear-gradient(to bottom right, #312e81, #6b21a8, #312e81)' 
                            : 'linear-gradient(to bottom right, #ffffff, #e0e7ff, #ffffff)',
                        textShadow: isVideoEnded ? 'none' : '0 0 40px rgba(0,0,0,0.5)'
                    }} 
                >
                    BIENVENIDO A<br/>
                    HUMAN DeFi<br/>
                    <span 
                        className={`text-4xl md:text-6xl block mt-4 transition-colors duration-1000 ${isVideoEnded ? 'text-indigo-900/40' : 'text-white/60'}`}
                    >
                        TU HOGAR EN WEB3
                    </span>
                </h1>

                {/* Button appears only after video ends */}
                <div 
                    className={`
                        transition-all duration-1000 transform
                        ${isVideoEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                    `}
                >
                    <button 
                        onClick={onStart}
                        className="
                            group relative px-12 py-6 bg-indigo-900 rounded-full text-white font-black text-2xl
                            overflow-hidden transition-all hover:scale-105 hover:bg-indigo-800 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)]
                        "
                        aria-label="Start Registration"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            COMENZAR
                            <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </button>
                </div>
            </div>
        </section>
    );
}
