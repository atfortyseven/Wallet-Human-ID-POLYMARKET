
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

interface GPULottieProps {
    src: string;
    width?: number;
    height?: number;
    className?: string;
    onHover?: () => void;
}

export function GPULottie({ src, width = 200, height = 200, className = "", onHover }: GPULottieProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [lottieInstance, setLottieInstance] = useState<DotLottie | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // 1. Hardware Initialization
    useEffect(() => {
        if (!canvasRef.current) return;

        const dotLottie = new DotLottie({
            canvas: canvasRef.current,
            src: src,
            loop: true,
            autoplay: false, // Wait for visibility
            renderConfig: {
                devicePixelRatio: window.devicePixelRatio || 1, // Retina support
            },
        });

        setLottieInstance(dotLottie);

        return () => {
             dotLottie.destroy();
        };
    }, [src]);

    // 2. The Kill-Switch (Intersection Observer)
    useEffect(() => {
        if (!containerRef.current || !lottieInstance) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                         setIsVisible(true);
                         lottieInstance.play();
                    } else {
                         setIsVisible(false);
                         lottieInstance.pause(); 
                         // Note: freeze() releases CPU, but keeps memory. 
                         // For 50 lotties, pause is usually sufficient if canvas is off-screen.
                    }
                });
            },
            { threshold: 0.1 } // 10% Visibility trigger
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [lottieInstance]);

    // 3. User Interaction (Haptics trigger)
    const handleMouseEnter = useCallback(() => {
        if (onHover) onHover();
        
        // Boost frame rate priority on hover
        if(lottieInstance) {
             lottieInstance.setSpeed(1.5); // Slight speed up on interact
        }
    }, [onHover, lottieInstance]);

    const handleMouseLeave = useCallback(() => {
        if(lottieInstance) {
             lottieInstance.setSpeed(1.0);
        }
    }, [lottieInstance]);

    return (
        <div 
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            style={{ width, height }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
             <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width: '100%', height: '100%' }}
             />
             {/* Fallback space occupied even if not rendered */}
        </div>
    );
}
