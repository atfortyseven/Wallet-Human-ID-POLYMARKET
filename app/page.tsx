'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { VideoScrubEngine } from '@/components/3d/VideoScrubEngine';
import { MetaMaskInterface } from '@/components/site/MetaMaskInterface';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { ZKVault } from '@/components/ZKVault';
import { BarrelDistortion } from '@/components/3d/effects/BarrelDistortion';
import { QuantumLeapEffectInternal } from '@/components/3d/effects/QuantumLeapEffect';
import { EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

// Componente que controla la distorsión basado en el scroll
function AnimatedDistortion() {
    const scroll = useScroll();
    const [distortion, setDistortion] = useState(0);
    
    useFrame(() => {
        if (!scroll) return;
        
        // Lógica de Distorsión:
        // 0% - 70%: Respiración suave (0.05)
        // 70% - 100%: Aumenta hasta 0.5 (Barril Intenso)
        
        let target = 0.05; 
        const triggerPoint = 0.7;
        
        if (scroll.offset > triggerPoint) {
            const progress = (scroll.offset - triggerPoint) / (1 - triggerPoint);
             target = 0.05 + progress * 0.45; 
        }
        
        // Lerp para suavidad (limitamos los re-renders asignando si cambia significativamente)
        const nextVal = THREE.MathUtils.lerp(distortion, target, 0.1);
        if (Math.abs(distortion - nextVal) > 0.001) {
            setDistortion(nextVal);
        }
    });

    return <BarrelDistortion distortion={distortion} />;
}

export default function Home() {
  return (
    <main className="main-container">
      <div className="canvas-layer">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1], fov: 75 }}>
          <color attach="background" args={['#000']} /> 
          
          <ScrollControls pages={10} damping={0.1}> {/* Slight damping for smoother scroll */}
            
            {/* 1. The Video Engine */}
            <Suspense fallback={null}>
                <VideoScrubEngine />
            </Suspense>

            {/* 2. Post-Processing Effects */}
            <EffectComposer disableNormalPass>
                 <AnimatedDistortion />
            </EffectComposer>

            {/* 3. The UI Overlay & Transitions */}
            <Scroll html style={{ width: '100%', height: '100%' }}>
               {/* Quantum Leap Effect - Inside Canvas for useScroll access */}
               <QuantumLeapEffectInternal />
               
               <DashboardTransition>
                   <div className="flex flex-col items-center justify-start w-full min-h-screen pb-20">
                       <MetaMaskInterface />
                       <div className="mt-20 w-full">
                            <FeaturesSection />
                       </div>
                       {/* ZK-Vault: Extended scroll experience */}
                       <div className="mt-32 w-full">
                            <ZKVault />
                       </div>
                   </div>
               </DashboardTransition>
            </Scroll>
            
          </ScrollControls>
          
        </Canvas>
      </div>

      <style jsx>{`
        .main-container {
          height: 100vh;
          width: 100vw;
          background: #000;
          overflow: hidden;
        }
        .canvas-layer {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </main>
  );
}

// ULTRA-OPTIMIZED DashboardTransition with RAF batching
const DashboardTransition = React.memo(function DashboardTransition({ children }: { children: React.ReactNode }) {
    const scroll = useScroll();
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(0.8);
    const [shroudOpacity, setShroudOpacity] = useState(0);
    const [pointerEvents, setPointerEvents] = useState<'none' | 'auto'>('none');
    const [shouldRender, setShouldRender] = useState(false);
    const rafRef = useRef<number | null>(null);

    useFrame(() => {
        if (!scroll) return;
        
        const offset = scroll.offset;
        
        // Batch all state updates using RAF to prevent layout thrashing
        if (rafRef.current) return; // Skip if RAF already scheduled
        
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            
            // Only start rendering UI when much closer to appearing (lazy load)
            if (offset > 0.82 && !shouldRender) {
                setShouldRender(true);
            }
            
            // --- 1. The Shroud (Quantum Leap Flash) ---
            const shroudStart = 0.8;
            const shroudPeak = 0.9;
            
            let sOpacity = 0;
            if (offset > shroudStart && offset < shroudPeak) {
                sOpacity = (offset - shroudStart) / (shroudPeak - shroudStart);
            } else if (offset >= shroudPeak) {
                sOpacity = 1;
            }
            
            // INCREASED threshold to reduce re-renders
            if (Math.abs(shroudOpacity - sOpacity) > 0.03) {
                setShroudOpacity(sOpacity);
            }

            // --- 2. Dashboard Immersion ---
            const uiStart = 0.85;
            
            if (offset > uiStart) {
                const progress = (offset - uiStart) / (1 - uiStart);
                
                // INCREASED threshold for opacity/scale updates
                if (Math.abs(opacity - progress) > 0.03) {
                    setOpacity(progress);
                    setScale(0.8 + progress * 0.2);
                }
                
                const newPointerEvents = progress > 0.9 ? 'auto' : 'none';
                if (pointerEvents !== newPointerEvents) {
                    setPointerEvents(newPointerEvents);
                }
            } else if (opacity > 0) {
                setOpacity(0);
                setScale(0.8);
                if (pointerEvents !== 'none') {
                    setPointerEvents('none');
                }
            }
        });
    });

    return (
        <>
            {/* The Shroud Layer (Flash) */}
            <div 
                className="fixed inset-0 z-40 pointer-events-none"
                style={{ 
                    opacity: shroudOpacity,
                    background: 'radial-gradient(circle at center, rgba(200, 220, 255, 0.2) 0%, rgba(255, 255, 255, 1) 40%, rgba(200, 230, 255, 1) 100%)',
                    mixBlendMode: 'plus-lighter',
                    willChange: 'opacity',
                    display: shroudOpacity > 0 ? 'block' : 'none'
                }}
            />
            
            {/* The Dashboard Interface - Only render when needed */}
            {shouldRender && (
                <div 
                    style={{ 
                        opacity: opacity, 
                        transform: `scale(${scale}) translateZ(0)`,
                        pointerEvents: pointerEvents,
                        willChange: 'opacity, transform'
                    }}
                    className="w-full h-full flex items-center justify-center"
                >
                    {children}
                </div>
            )}
        </>
    );
});
