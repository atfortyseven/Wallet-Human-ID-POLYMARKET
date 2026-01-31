"use client";

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { StackableCarousel } from '../ui/StackableCarousel';
import LottieCard from '../ui/LottieCard';
import { LOTTIE_CONTENT } from './lottie-content';

export function EcosystemCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollAmount = direction === 'left' ? -320 : 320;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    // Note: We can track active index with intersection observer if needed for dots,
    // but for now simple scroll buttons are sufficient.

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-20 relative group">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest opacity-80">
                        Human Ecosystem
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-md">
                        Explora las 15 dimensiones de la revolución financiera humana.
                        Desliza para ver el futuro.
                    </p>
                </div>
                
                {/* Controls */}
                <div className="hidden md:flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
                    >
                        <ArrowRight size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            {/* We use a custom ref access to the StackableCarousel's div if possible, OR we wrap it.
                StackableCarousel doesn't expose ref by default. 
                For simple button control, we can just reimplement the div structure here or modify Stackable props.
                Let's use the div structure directly here for maximum control over the 15 items.
            */}
            
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {LOTTIE_CONTENT.map((item, index) => (
                    <div 
                        key={item.id} 
                        className="min-w-[85vw] sm:min-w-[400px] snap-center shrink-0 h-[450px]"
                    >
                        <LottieCard 
                            lottieSrc={item.src}
                            title={item.title}
                            subtitle={item.subtitle}
                            lottieSize="lg"
                            className="h-full bg-zinc-900/50 border-white/10 hover:border-blue-500/50 transition-all group-hover:hover:scale-[1.02]"
                        />
                        <div className="mt-3 flex justify-between items-center px-1">
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{item.category}</span>
                            <span className="text-xs font-mono text-zinc-600">{(index + 1).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar / Dots indicator could go here */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-blue-500/50 w-1/3 rounded-full" /> 
                {/* Static for now, would need scroll listener for dynamic width */}
            </div>

        </div>
    );
}
