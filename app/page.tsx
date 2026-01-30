'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { VideoScrubEngine } from '@/components/3d/VideoScrubEngine';
import { HumanDefiHeader } from '@/components/landing/HumanDefiHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { WalletPreview } from '@/components/landing/WalletPreview';
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection';
import { SecurityGrowthSection } from '@/components/landing/SecurityGrowthSection';
import { Web3AccessSection } from '@/components/landing/Web3AccessSection';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { ZKVault } from '@/components/ZKVault';
import { BarrelDistortion } from '@/components/3d/effects/BarrelDistortion';
import { QuantumLeapEffectInternal } from '@/components/3d/effects/QuantumLeapEffect';
import { EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAuth } from '@/hooks/useAuth';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import dynamic from 'next/dynamic';

// Dynamic import for the heavy wallet component
const WalletSection = dynamic(() => import('@/components/WalletSection'), { ssr: false });

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

function DashboardContent() {
    const { isConnected } = useAppKitAccount();
    const { isAuthenticated } = useAuth();
    const { open } = useAppKit();

    // If connected/auth, show full dashboard
    if (isConnected || isAuthenticated) {
        return (
            <div className="w-full mt-24">
                <WalletSection />
            </div>
        );
    }

    // Otherwise show landing page
    return (
        <>
            <MetaMaskInterface onConnect={() => open()} />
            <div className="mt-20 w-full">
                <FeaturesSection />
            </div>
            <div className="mt-32 w-full">
                <ZKVault />
            </div>
        </>
    );
}

export default function Home() {
  const { isConnected } = useAppKitAccount();
  const { isAuthenticated } = useAuth();
  const { open } = useAppKit();
  
  // State for the "Loading" transition to registration/lobby
  const [isLoadingLobby, setIsLoadingLobby] = useState(false);

  const handleStart = () => {
      setIsLoadingLobby(true);
      // Simulate fast loading, then open connection logic or direct to lobby if connected
      setTimeout(() => {
          if (!isConnected && !isAuthenticated) {
              open(); 
          }
          setIsLoadingLobby(false);
      }, 1500);
  };

  // If fully authenticated, show the Real Wallet Lobby (No Scroll Story needed? Or maybe still accessible?)
  // For now, let's assume if authenticated, we go straight to wallet.
  if (isConnected || isAuthenticated) {
      return (
        <main className="fixed inset-0 bg-black overflow-hidden">
             {/* 3D Background persists delicately? Or maybe strict black for "Lobby" efficiency? 
                 User asked for "our scroll and background", so we keep it even in Dashboard?
                 Let's keep it for visual consistency but maybe reduced.
             */}
             <div className="absolute inset-0 z-0">
                <Canvas 
                    dpr={[1, 2]} 
                    gl={{ powerPreference: 'high-performance', antialias: false, stencil: false, depth: false }}
                >
                    <color attach="background" args={['#000']} />
                    <Suspense fallback={null}><VideoScrubEngine /></Suspense>
                    <EffectComposer><BarrelDistortion distortion={0} /></EffectComposer>
                 </Canvas>
             </div>

             {/* The Real Wallet Lobby */}
             <div className="relative z-10 w-full h-full overflow-y-auto">
                <HumanDefiHeader /> 
                <div className="pt-24 px-4">
                    <WalletSection />
                </div>
             </div>
        </main>
      );
  }

  // LANDING PAGE MODE (Scroll Story)
  return (
    <main className="main-container">
       <HumanDefiHeader />

       {/* Loading Overlay */}
       {isLoadingLobby && (
           <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
               <div className="text-blue-500 animate-pulse text-2xl font-bold font-mono">
                   CONNECTING TO ON-CHAIN REGISTRY...
               </div>
           </div>
       )}

      <div className="canvas-layer">
        <Canvas 
            dpr={[1, 2]} 
            camera={{ position: [0, 0, 1], fov: 75 }}
            gl={{ 
                powerPreference: 'high-performance',
                antialias: false,
                stencil: false,
                depth: false
            }}
        >
          <color attach="background" args={['#000']} /> 
          
          <ScrollControls pages={12} damping={0.2} style={{ scrollBehavior: 'smooth' }}>
            
            {/* 1. The Video Engine (Background) */}
            <Suspense fallback={null}>
                <VideoScrubEngine />
            </Suspense>

            {/* 2. Effects */}
            <EffectComposer>
                 <AnimatedDistortion />
            </EffectComposer>

            {/* 3. The Scroll Story Content */}
            <Scroll html style={{ width: '100vw' }}>
                
                {/* PAGE 1: HERO */}
                <LandingHero onStart={handleStart} />

                {/* PAGE 2: WALLET VISUALIZATION */}
                <div className="w-full h-[150vh] flex items-center justify-center opacity-0 animate-fade-in-scroll">
                     {/* We will fade this in via CSS in logic later or rely on scroll position */}
                     <WalletPreview />
                </div>

                {/* PAGE 3: FEATURE CARDS (5 Cards) */}
                <div className="w-full min-h-screen flex items-center justify-center py-20">
                    <FeatureCardsSection />
                </div>

                {/* PAGE 4: SECURITY & GROWTH (8 Cards + Text) */}
                <div className="w-full min-h-screen py-20">
                    <SecurityGrowthSection />
                </div>

                {/* PAGE 5: BENEFITS & ACCESS (Cartoon + News) */}
                <div className="w-full min-h-screen py-20">
                    <Web3AccessSection />
                </div>

                {/* PAGE 6: FOOTER */}
                <div className="w-full">
                    <HumanDefiFooter />
                </div>
                
            </Scroll>
            
          </ScrollControls>
          
        </Canvas>
      </div>

      <style jsx>{`
        .main-container {
          height: 100dvh;
          width: 100vw;
          background: #000;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
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
                // Fade In
                sOpacity = (offset - shroudStart) / (shroudPeak - shroudStart);
            } else if (offset >= shroudPeak) {
                // Fade Out (Reveal Dashboard)
                const fadeOutRange = 0.1; // 0.9 to 1.0
                const exitProgress = (offset - shroudPeak) / fadeOutRange;
                sOpacity = Math.max(0, 1 - exitProgress);
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
