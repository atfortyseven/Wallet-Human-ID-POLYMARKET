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
import { TitaniumGate, useGateState } from '@/components/layout/TitaniumGate';
import { LenisProvider } from '@/components/creative/LenisProvider';
import { LottieStack } from '@/components/creative/LottieStack';

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
import { CommunityInfo } from '@/components/CommunityInfo';

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

  // Hook to check gate state
  const gateState = useGateState();

  const handleStart = () => {
    setIsLoadingLobby(true);
    setTimeout(() => {
      if (!isConnected && !isAuthenticated) {
        open(); 
      }
      setIsLoadingLobby(false);
    }, 1000);
  };

  // Always show the landing page - users can navigate to Wallet via the header menu
  // const showLobby = isMounted && (isConnected || isAuthenticated);

  return (
    <TitaniumGate>
        <main className="relative min-h-screen w-full bg-[#F5F5DC] text-neutral-900 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
            
            {/* ============================================
                LAYER 0: GPU-ISOLATED BACKGROUND
            ============================================ */}
            <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
                 <FluidBeigeBackground />
            </div>

            {/* ============================================
                LAYER 1: CONTENT
            ============================================ */}
            <div className="relative z-10 flex flex-col">
                
                {/* Header (Only show after authentication) */}
                {gateState === 'APP' && <HumanDefiHeader />}

                {/* Loading Overlay */}
                {isLoadingLobby && (
                   <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl flex items-center justify-center">
                       <div className="text-white animate-pulse text-2xl font-bold font-mono">
                           CONNECTING...
                       </div>
                   </div>
                )}

                {/* Always show landing page - wallet access via menu */}
                {/* SECTION 1: HERO (Critical for LCP - Largest Contentful Paint) */}
                    <section className="relative w-full h-[100dvh]">
                        <LandingHero onStart={handleStart} />
                    </section>

                    {/* HIGH PERFORMANCE STACK (Replaces standard grid) */}
                    <div className="relative z-20">
                        <LenisProvider>
                             <LottieStack items={[
                                 {
                                     title: "Human Wallet",
                                     description: "Non-custodial, biometric-secured vault for your digital assets.",
                                     lottieSrc: "https://lottie.host/8d48bb95-7124-4224-bcae-2144799011af/lHDi1Xo9qO.lottie"
                                 },
                                 {
                                     title: "Prediction Markets",
                                     description: "Trade on future outcomes with zero-knowledge privacy.",
                                     lottieSrc: "https://lottie.host/8d48bb95-7124-4224-bcae-2144799011af/lHDi1Xo9qO.lottie"
                                 },
                                 {
                                     title: "Yield Governance",
                                     description: "Earn rewards by participating in protocol decisions.",
                                     lottieSrc: "https://lottie.host/8d48bb95-7124-4224-bcae-2144799011af/lHDi1Xo9qO.lottie"
                                 },
                                 {
                                      title: "Global Settlements",
                                      description: "Instant cross-border transfers with stablecoin liquidity.",
                                      lottieSrc: "https://lottie.host/8d48bb95-7124-4224-bcae-2144799011af/lHDi1Xo9qO.lottie"
                                 }
                             ]} />
                        </LenisProvider>
                    </div>

                    {/* SECTION 5: WEB3 ACCESS & FOOTER (Fluid Background Area) */}
                    <section className="relative w-full overflow-hidden">
                        {/* Background Layer */}
                        <div className="absolute inset-0 z-0 transform-gpu translate-3d-0">
                             <FluidBeigeBackground />
                        </div>
                        
                        <div className="relative z-10 w-full pt-32 pb-10 optimize-visibility">
                            <Web3AccessSection />
                            <HumanDefiFooter />
                        </div>
                    </section>
            </div>
        </main>
    </TitaniumGate>
  );
}
