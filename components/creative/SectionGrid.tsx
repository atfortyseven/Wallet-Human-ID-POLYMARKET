
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GPULottie } from './GPULottie';
import { useHaptic } from '@/hooks/useHaptic';

interface SectionProps {
    title: string;
    description: string;
    animations: string[]; // Paths to lotties
    id: string;
}

export function SectionGrid({ title, description, animations, id }: SectionProps) {
    const { trigger } = useHaptic();

    return (
        <section id={id} className="min-h-screen py-24 px-4 md:px-12 relative flex flex-col md:grid md:grid-cols-12 gap-8 border-b border-white/5">
            {/* Sticky Header Channel */}
            <div className="md:col-span-3 lg:col-span-4 relative">
                <div className="sticky top-24">
                     <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-20%" }}
                        className="text-6xl md:text-8xl font-black text-[#B0B0A0] tracking-tighter mb-8"
                     >
                        {title}
                     </motion.h2>
                     <p className="text-xl text-[#B0B0A0]/60 font-light leading-relaxed max-w-sm">
                        {description}
                     </p>
                </div>
            </div>

            {/* The Grid */}
            <div className="md:col-span-9 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {animations.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="aspect-square bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center cursor-pointer group hover:bg-white/[0.06] transition-colors"
                        onMouseEnter={() => trigger('light')}
                        onClick={() => trigger('heavy')}
                    >
                         <GPULottie 
                            src={src} 
                            width={120} 
                            height={120}
                            onHover={() => trigger('light')}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
