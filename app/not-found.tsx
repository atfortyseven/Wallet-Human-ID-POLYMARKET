import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Noise */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />

            <div className="relative z-10">
                <h1 className="text-[120px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-20 select-none">
                    404
                </h1>

                <div className="mt-[-40px]">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 mb-6">
                        <AlertTriangle size={16} />
                        <span className="font-mono text-xs tracking-widest uppercase">Signal Lost</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Timeline Desynchronized
                    </h2>
                    <p className="text-[#888899] max-w-md mx-auto mb-8 font-mono text-sm leading-relaxed">
                        The node you are trying to reach does not exist in this reality fragment. It may have been liquidated or never deployed.
                    </p>

                    <Link
                        href="/"
                        className="inline-block px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f2ea] text-white font-mono uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        Re-establish Uplink
                    </Link>
                </div>
            </div>
        </div>
    );
}
