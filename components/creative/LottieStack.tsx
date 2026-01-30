
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { GPULottie } from './GPULottie';

interface LottieStackProps {
    items: {
        title: string;
        description: string;
        lottieSrc: string;
    }[];
}

// Individual Card Component
function Card({ i, title, description, src, progress, range, targetScale }: { 
    i: number; 
    title: string; 
    description: string; 
    src: string; 
    progress: MotionValue<number>; 
    range: [number, number]; 
    targetScale: number; 
}) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div 
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }} 
                className="flex flex-col relative -top-[25%] h-[500px] w-[1000px] rounded-[25px] p-12 origin-top bg-neutral-900 border border-neutral-800 shadow-2xl"
            >
                <div className="flex h-full gap-12">
                    <div className="w-[40%] flex flex-col justify-center">
                         <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{title}</h2>
                         <p className="text-neutral-400 text-lg leading-relaxed">{description}</p>
                    </div>

                    <div className="w-[60%] h-full rounded-[20px] overflow-hidden relative bg-black/20 inner-shadow">
                        <motion.div style={{ scale: imageScale }} className="w-full h-full flex items-center justify-center">
                             <GPULottie src={src} width={400} height={400} />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function LottieStack({ items }: LottieStackProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={container} className="relative mt-[20vh]">
            {items.map((item, i) => {
                // Calculate scale range for stacking effect
                const targetScale = 1 - ((items.length - i) * 0.05); 
                return (
                    <Card 
                        key={i} 
                        i={i} 
                        {...item} 
                        src={item.lottieSrc}
                        progress={scrollYProgress} 
                        range={[i * 0.25, 1]} 
                        targetScale={targetScale}
                    />
                );
            })}
        </div>
    );
}
