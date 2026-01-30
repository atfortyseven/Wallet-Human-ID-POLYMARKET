
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSequenceProps {
    onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    useEffect(() => {
        // Force play immediately on mount
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.error("Autoplay failed (interaction needed):", err);
                // Fallback: Click to play if browser blocks autoplay
            });
        }
    }, []);

    const handleEnded = () => {
        setHasEnded(true);
        // Delay signalling completion slightly to allow fade out animation
        setTimeout(onComplete, 800); 
    };

    return (
        <AnimatePresence>
            {!hasEnded && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src="/models/kanagawa-wave.mp4"
                        muted
                        playsInline
                        autoPlay
                        onLoadedData={() => setIsVideoLoaded(true)}
                        onEnded={handleEnded}
                        style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                    />
                    
                    {/* Fallback / Loading State */}
                    {!isVideoLoaded && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                         </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
