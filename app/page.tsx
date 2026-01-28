import { GlassCard } from '@/components/ui/GlassComponents';
import { CreateMarketForm } from '@/components/CreateMarketForm';
import { MarketFeed } from '@/components/MarketFeed';
import { NewsGrid } from '@/components/crystalline/NewsGrid'; // Restored Import
import { ArrowDown } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen relative bg-slate-900 selection:bg-cyan-500/30 pb-20 overflow-x-hidden">

            {/* FONDOS DINÁMICOS (The "Wallpaper") */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-blob mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-blob animation-delay-2000 mix-blend-screen" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-600/10 blur-[100px] rounded-full animate-blob animation-delay-4000 mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 container mx-auto px-4">

                {/* SECCIÓN HERO: Crear Mercado (Mantenemos como principal) */}
                <section className="min-h-[85vh] flex flex-col items-center justify-center pt-20 relative">
                    <CreateMarketForm />

                    <div className="absolute bottom-10 animate-bounce text-white/30 hidden md:block">
                        <ArrowDown size={24} />
                    </div>
                </section>

                {/* SECCIÓN: News Feed (Restored & Prioritized) */}
                <section className="py-20 border-t border-white/5 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4">
                            Global Intel Feed
                        </h2>
                        <p className="text-blue-200/50 max-w-2xl mx-auto">
                            Real-time intelligence from the world's leading sources.
                        </p>
                    </div>

                    <NewsGrid category="general" />
                </section>

                {/* SECCIÓN MARKETS: Mercados en Base Sepolia */}
                <section className="py-20 border-t border-white/5 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    {/* MarketFeed ya tiene su propio header "Mercados en Base Sepolia" */}
                    <MarketFeed />
                </section>

            </div>
        </main>
    );
}
