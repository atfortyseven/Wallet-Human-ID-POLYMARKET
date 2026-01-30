'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

// ============================================
// 1. CRITICAL IMPORTS (Above the Fold - Load Immediately)
// ============================================
import { HumanDefiHeader } from '@/components/landing/HumanDefiHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import FluidBeigeBackground from '@/components/layout/FluidBeigeBackground';

// ============================================
// 2. LAZY IMPORTS (Below the Fold - Load on Demand)
// ============================================
const WalletPreview = dynamic(() => import('@/components/landing/WalletPreview').then(mod => mod.WalletPreview), { 
  loading: () => <div className="h-[80vh] w-full animate-pulse bg-neutral-100/50 rounded-3xl" /> 
});
const FeatureCardsSection = dynamic(() => import('@/components/landing/FeatureCardsSection').then(mod => mod.FeatureCardsSection));
const SecurityGrowthSection = dynamic(() => import('@/components/landing/SecurityGrowthSection').then(mod => mod.SecurityGrowthSection));
const Web3AccessSection = dynamic(() => import('@/components/landing/Web3AccessSection').then(mod => mod.Web3AccessSection));
const HumanDefiFooter = dynamic(() => import('@/components/landing/HumanDefiFooter').then(mod => mod.HumanDefiFooter));

// Heavy Wallet - Only load when absolutely necessary
const WalletSection = dynamic(() => import('@/components/WalletSection'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center text-neutral-400 font-mono">
      Cargando Bóveda...
    </div>
  )
});

export default function Home() {
  const { isConnected } = useAppKitAccount();
  const { isAuthenticated } = useAuth();
  const { open } = useAppKit();
  
  // Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingLobby, setIsLoadingLobby] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Force hardware acceleration on iOS
    if (typeof document !== 'undefined') {
      (document.body.style as any).webkitFontSmoothing = 'antialiased';
    }
  }, []);

  const handleStart = () => {
    setIsLoadingLobby(true);
    setTimeout(() => {
      if (!isConnected && !isAuthenticated) {
        open(); 
      }
      setIsLoadingLobby(false);
    }, 1000);
  };

  const showLobby = isMounted && (isConnected || isAuthenticated);

  return (
    <main className="relative min-h-screen w-full bg-[#F5F5DC] text-neutral-900 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
        
        {/* ============================================
            LAYER 0: GPU-ISOLATED BACKGROUND
            Fixed positioning removes from document flow
            pointer-events-none ensures scroll isn't blocked
            transform-gpu forces GPU compositor layer
            ============================================ */}
        <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
             <FluidBeigeBackground />
        </div>

        {/* ============================================
            LAYER 1: CONTENT
            Relative positioning with z-10 ensures it's above canvas
            ============================================ */}
        <div className="relative z-10 flex flex-col">
            
            {/* Header (Always Visible) */}
            <HumanDefiHeader />

            {/* Loading Overlay */}
            {isLoadingLobby && (
               <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl flex items-center justify-center">
                   <div className="text-white animate-pulse text-2xl font-bold font-mono">
                       CONNECTING...
                   </div>
               </div>
            )}

            {showLobby ? (
                // ============================================
                // AUTHENTICATED LOBBY (Wallet Interface) - Clean Dark BG
                // ============================================
                <div key="lobby" className="pt-24 px-4 pb-20 min-h-screen animate-in fade-in duration-500">
                    <WalletSection />
                </div>
            ) : (
                // ============================================
                // LANDING PAGE (Marketing Site)
                // Each section uses 'optimize-visibility' for viewport virtualization
                // ============================================
                <div key="landing" className="flex flex-col w-full">
                    
                    {/* SECTION 1: HERO (Critical for LCP - Largest Contentful Paint) */}
                    <section className="relative w-full h-[100dvh]">
                        <LandingHero onStart={handleStart} />
                    </section>

                    {/* SECTION 2: WALLET PREVIEW (Viewport Virtualized) */}
                    <section className="relative w-full py-20 min-h-[80vh] flex items-center justify-center optimize-visibility">
                        <WalletPreview />
                    </section>

                    {/* SECTION 3: FEATURES (Viewport Virtualized) */}
                    <section className="relative w-full py-20 optimize-visibility">
                        <FeatureCardsSection />
                    </section>

                    {/* SECTION 4: SECURITY (Viewport Virtualized) */}
                    <section className="relative w-full py-20 optimize-visibility">
                        <SecurityGrowthSection />
                    </section>

                    {/* SECTION 5: WEB3 ACCESS (Viewport Virtualized) */}
                    <section className="relative w-full py-32 optimize-visibility">
                        <Web3AccessSection />
                    </section>

                    {/* FOOTER */}
                    <HumanDefiFooter />
                </div>
            )}
        </div>
    </main>
  );
}
