// components/MainVault.tsx
import { useWLD } from '../hooks/useWLD'

interface MainVaultProps {
    onConnect?: () => void;
}

export const MainVault = ({ onConnect }: MainVaultProps) => {
    const { balance, symbol, status, isLoading } = useWLD()

    return (
        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Background Glow for Connected State */}
            {status === 'connected' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-0" />
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        Net Worth Estimate <span className="rotate-180">↺</span>
                    </p>
                    <h2 className="text-6xl font-bold mt-2 tracking-tighter">
                        ${isLoading ? '...' : (Number(balance) * 0.45).toFixed(2)}
                        <span className="text-lg align-top ml-1 text-gray-400">,00</span>
                    </h2>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold">
                    ↗ 0%
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 relative z-10">
                <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">WLD Balance</p>
                    <p className="text-xl font-mono font-semibold">
                        {isLoading ? '---' : `${parseFloat(balance).toFixed(4)}`}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Status</p>
                    {status === 'connected' ? (
                        <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            CONNECTED
                        </p>
                    ) : (
                        <button
                            onClick={onConnect}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors"
                        >
                            CONNECT WORLD APP
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
