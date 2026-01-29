'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChronosLensProps {
    status: 'verified' | 'unconfirmed' | 'disputed';
    truthScore: number;
    sources?: number;
    provenanceStamp?: string;
}

export function ChronosLens({ status, truthScore, sources = 0, provenanceStamp }: ChronosLensProps) {
    const [isHovered, setIsHovered] = useState(false);

    const statusConfig = {
        verified: {
            color: 'from-emerald-400 via-cyan-400 to-teal-400',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6),inset_0_0_20px_rgba(16,185,129,0.3)]',
            ring: 'border-emerald-500/40',
            pulse: false,
            label: 'VERIFIED',
            icon: '✓',
            tooltip: 'Institutional consensus confirmed'
        },
        unconfirmed: {
            color: 'from-amber-400 via-yellow-400 to-orange-400',
            glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6),inset_0_0_20px_rgba(251,191,36,0.3)]',
            ring: 'border-amber-500/40',
            pulse: true,
            label: 'UNCONFIRMED',
            icon: '?',
            tooltip: 'Developing story, sources conflict'
        },
        disputed: {
            color: 'from-red-500 via-rose-500 to-pink-500',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.6),inset_0_0_20px_rgba(239,68,68,0.3)]',
            ring: 'border-red-500/40',
            pulse: true,
            label: 'DISPUTED',
            icon: '!',
            tooltip: 'High risk, factual discrepancies detected'
        }
    };

    const config = statusConfig[status];

    return (
        <div 
            className="relative flex flex-col items-center gap-2 p-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Lens */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Metallic Bezel (Outer Ring) - 3D effect with shadows */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-500 to-zinc-700 shadow-xl" style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.2)'
                }} />
                
                {/* Inner bezel ring */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-900" style={{
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                }} />
                
                {/* Glass Lens (Inner Circle) with complex layered effect */}
                <motion.div
                    className={`absolute inset-3 rounded-full bg-gradient-to-br ${config.color} ${config.glow} border-2 ${config.ring}`}
                    animate={config.pulse ? {
                        opacity: [0.7, 1, 0.7],
                        scale: [0.98, 1.02, 0.98],
                    } : {}}
                    transition={{
                        duration: status === 'disputed' ? 0.8 : 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%), linear-gradient(135deg, ${config.color})`,
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    {/* Multiple glass refraction layers */}
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/10" />
                    
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {config.icon}
                    </div>

                    {/* Disputed flicker effect */}
                    {status === 'disputed' && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-400/20"
                            animate={{
                                opacity: [0, 0.5, 0, 0.3, 0],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.3, 0.5, 0.7, 1]
                            }}
                        />
                    )}
                </motion.div>

                {/* Scanning Beam (On Hover) */}
                {isHovered && (
                    <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[1px]"
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Status Label */}
            <div className="text-[10px] font-mono text-zinc-400 tracking-wider font-bold">
                {config.label}
            </div>

            {/* Truth Score */}
            <div className="text-xs font-bold text-white">
                {truthScore}% <span className="text-zinc-500">•</span> {sources} sources
            </div>

            {/* Provenance Stamp */}
            <div className="text-[8px] font-mono text-zinc-600 tracking-tight">
                {provenanceStamp || 'PROTOCOL V3.1 // ANALYSIS COMPLETE'}
            </div>

            {/* Tooltip on Hover */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 bg-black/95 backdrop-blur-md border border-zinc-700 rounded-lg px-3 py-2 min-w-[220px] z-20 shadow-2xl"
                >
                    <div className="text-xs text-white font-medium mb-1">
                        Credibility Analysis
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-relaxed">
                        {config.tooltip}
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-2 pt-2 border-t border-zinc-700">
                        Semantic consensus engine • {sources} sources analyzed
                    </div>
                </motion.div>
            )}
        </div>
    );
}
