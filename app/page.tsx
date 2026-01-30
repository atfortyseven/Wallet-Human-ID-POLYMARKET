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
