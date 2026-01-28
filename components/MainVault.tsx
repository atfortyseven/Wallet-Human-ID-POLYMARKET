// components/MainVault.tsx
import { useWLD } from '../hooks/useWLD'
import { useChainId, useAccount, useConnect } from 'wagmi';

interface MainVaultProps {
    onConnect?: () => void;
}

// Función para obtener nombre y color según ID
const getNetworkDetails = (chainId: number | undefined) => {
    switch (chainId) {
        case 10: return { name: 'Optimism', color: 'bg-red-500' }; // World App runs here
        case 1: return { name: 'Mainnet', color: 'bg-blue-500' };
        case 42161: return { name: 'Arbitrum', color: 'bg-blue-600' };
        case 8453: return { name: 'Base', color: 'bg-blue-500' };
        case 137: return { name: 'Polygon', color: 'bg-purple-500' };
        default: return { name: 'Unknown Network', color: 'bg-yellow-500' };
    }
};

export const MainVault = ({ onConnect }: MainVaultProps) => {
    const { balance, symbol, status, isLoading } = useWLD()
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const network = getNetworkDetails(chainId);

    const handleUniversalConnect = () => {
        // Buscamos el conector de WalletConnect para máxima compatibilidad con World App
        const connector = connectors.find((c) => c.id === 'walletConnect');
        if (connector) {
            connect({ connector });
        } else {
            // Fallback por si no se encuentra
            if (onConnect) onConnect();
        }
    };

    return (
        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Background Glow for Connected State */}
            {status === 'connected' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-0" />
            )}

            {/* Network Indicator (Dynamic) */}
            <div className="relative z-10 flex items-center gap-2 mb-6">
                <div className={`h-2.5 w-2.5 rounded-full ${network.color} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">{network.name}</span>
            </div>

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
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold h-fit">
                    ↗ 0%
                </div>
            </div>

            {/* Bottom Section: Status & Connect */}
            <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
                {isConnected ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg w-fit">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-sm font-bold">WALLET CONNECTED</span>
                    </div>
                ) : (
                    <button
                        onClick={onConnect}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-xl"
                    >
                        CONNECT WALLET
                    </button>
                )}
            </div>
        </div>
    )
}
