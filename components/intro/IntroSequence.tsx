
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
                console.warn("Autoplay failed/blocked:", err);
                // If autoplay fails, we can either show a "Play" button or just skip
                // For now, let's treat it as "ended" after a short delay so users aren't stuck
                setTimeout(onComplete, 2000);
            });
        }

        // Safety timeout: if video hangs or doesn't end for any reason, force proceed after 8 seconds
        const safetyTimer = setTimeout(() => {
            if (!hasEnded) {
                console.log("Intro safety timer triggered");
                onComplete();
            }
        }, 8000);

        return () => clearTimeout(safetyTimer);
    }, []);

    const handleEnded = () => {
        if (hasEnded) return;
        setHasEnded(true);
        setTimeout(onComplete, 500); 
    };

    return (
        <AnimatePresence>
            {!hasEnded && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onClick={onComplete} // Allow user to click to skip
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
                        onError={(e) => {
                            console.error("Video error:", e);
                            onComplete(); // Skip if video fails
                        }}
                        style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                    />
                    
                    {/* Fallback / Loading State */}
                    {!isVideoLoaded && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                         </div>
                    )}
                    
                    <div className="absolute bottom-10 text-white/20 text-xs font-mono uppercase tracking-widest animate-pulse">
                        Click to skip
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
