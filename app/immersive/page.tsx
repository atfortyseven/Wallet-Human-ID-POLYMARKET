
'use client';

import React from 'react';
import { LenisProvider } from '@/components/creative/LenisProvider';
import { SectionGrid } from '@/components/creative/SectionGrid';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Shield, Zap, Globe, Lock, Coins, Vote } from 'lucide-react';

export default function ImmersivePage() {
    
    // MOCK DATA - simulating 10 lotties per section.
    // In production, these would be unique paths.
    // Using a known heavy animation to stress test first.
    const COMMON_LOTTIE = 'https://lottie.host/8d48bb95-7124-4224-bcae-2144799011af/lHDi1Xo9qO.lottie'; 
    // ^ This is a sample dotLottie file. 
    
    const SECTIONS = [
        {
            id: 'human-defi',
            title: 'HUMAN DEFI',
            description: 'Access the global financial system without barriers. Wallet, Yield, and Swaps empowered by World ID.',
            animations: Array(10).fill(COMMON_LOTTIE)
        },
        {
             id: 'nueva',
             title: 'NUEVA',
             description: 'Modern prediction markets and perpetual contracts. High-frequency trading with zero-knowledge privacy.',
             animations: Array(10).fill(COMMON_LOTTIE)
        },
        {
             id: 'productos',
             title: 'PRODUCTOS',
             description: 'Physical cards, stablecoins, and the infrastructure connecting fiat to crypto.',
             animations: Array(10).fill(COMMON_LOTTIE)
        },
        {
             id: 'aprender',
             title: 'APRENDER',
             description: 'For developers and creators. SDKs, APIs, and the documentation to build the next web.',
             animations: Array(10).fill(COMMON_LOTTIE)
        },
        {
             id: 'acerca',
             title: 'ACERCA',
             description: 'Institutional grade security. 24/7 Support. The fortress for your digital identity.',
             animations: Array(10).fill(COMMON_LOTTIE)
        }
    ];

    return (
        <LenisProvider>
            <div className="bg-[#1C1C1A] min-h-screen text-[#EAEADF] selection:bg-[#EAEADF] selection:text-[#1C1C1A]">
                <SiteHeader />
                
                <main className="pt-32">
                    {/* Intro Hero */}
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-[12vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#EAEADF] to-[#707060] opacity-90">
                            120 FPS
                        </h1>
                        <p className="mt-4 text-xl md:text-2xl font-mono text-[#707060]">
                            IMMERSIVE EXPERIENCE
                        </p>
                    </div>

                    {/* The Sections */}
                    <div className="relative z-10 bg-[#1C1C1A]">
                         {SECTIONS.map((section, i) => (
                             <SectionGrid 
                                 key={i}
                                 {...section}
                             />
                         ))}
                    </div>
                </main>

                <div className="p-4 bg-[#1C1C1A] text-[#707060] font-mono text-center text-xs uppercase tracking-widest border-t border-white/5">
                    Rendered on GPU • Inertial Physics Enabled
                </div>
            </div>
        </LenisProvider>
    );
}
