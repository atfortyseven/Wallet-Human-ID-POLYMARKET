'use client';

import React, { useState } from 'react';
import FluidBeigeBackground from '@/components/layout/FluidBeigeBackground';
import { HumanDefiHeader } from '@/components/landing/HumanDefiHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { WalletPreview } from '@/components/landing/WalletPreview';
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection';
import { SecurityGrowthSection } from '@/components/landing/SecurityGrowthSection';
import { Web3AccessSection } from '@/components/landing/Web3AccessSection';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { useAuth } from '@/hooks/useAuth';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import dynamic from 'next/dynamic';

// Dynamic import for the heavy wallet component
const WalletSection = dynamic(() => import('@/components/WalletSection'), { ssr: false });

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
    return null; // Logic handled in main component now
}

export default function Home() {
  const { isConnected } = useAppKitAccount();
  const { isAuthenticated } = useAuth();
  const { open } = useAppKit();
  
  // State for the "Loading" transition
  const [isLoadingLobby, setIsLoadingLobby] = useState(false);

  const handleStart = () => {
      setIsLoadingLobby(true);
      setTimeout(() => {
          if (!isConnected && !isAuthenticated) {
              open(); 
          }
          setIsLoadingLobby(false);
      }, 1000);
  };

  // 1. AUTHENTICATED LOBBY
  if (isConnected || isAuthenticated) {
      return (
        <main className="fixed inset-0 overflow-hidden bg-[#F5F5DC]">
             <FluidBeigeBackground />
             
             {/* The Real Wallet Lobby */}
             <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar">
                <HumanDefiHeader /> 
                <div className="pt-24 px-4 pb-20">
                    <WalletSection />
                </div>
             </div>
        </main>
      );
  }

  // 2. LANDING PAGE (Standard Scroll, High Perf)
  return (
    <main className="min-h-screen w-full relative bg-[#F5F5DC] text-neutral-900 selection:bg-orange-200 selection:text-orange-900">
       <FluidBeigeBackground />
       
       <div className="relative z-10">
           <HumanDefiHeader />

           {/* Loading Overlay */}
           {isLoadingLobby && (
               <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl flex items-center justify-center">
                   <div className="text-white animate-pulse text-2xl font-bold font-mono">
                       CONNECTING...
                   </div>
               </div>
           )}

           <div className="flex flex-col">
                <LandingHero onStart={handleStart} />
                
                <div className="w-full flex items-center justify-center py-20 min-h-[80vh]">
                     <WalletPreview />
                </div>

                <div className="w-full py-20">
                    <FeatureCardsSection />
                </div>

                <div className="w-full py-20">
                    <SecurityGrowthSection />
                </div>

                <div className="w-full py-32">
                    <Web3AccessSection />
                </div>

                <HumanDefiFooter />
           </div>
       </div>
    </main>
  );
}
