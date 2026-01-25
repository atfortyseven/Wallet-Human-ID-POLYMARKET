"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useChainId, useSwitchChain, useDisconnect, useConnect, useEnsName } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { Wallet, ChevronDown, Circle, LogOut, Link2, AlertTriangle, Loader2 } from "lucide-react";

// Supported Chains Config
const SUPPORTED_CHAINS = [
    { id: mainnet.id, name: "Ethereum", short: "ETH", color: "bg-blue-500" },
    { id: polygon.id, name: "Polygon", short: "MATIC", color: "bg-purple-500" },
    { id: optimism.id, name: "OP Mainnet", short: "OP", color: "bg-red-500" },
    { id: arbitrum.id, name: "Arbitrum One", short: "ARB", color: "bg-sky-500" },
    { id: base.id, name: "Base", short: "BASE", color: "bg-blue-600" },
];

export default function WalletConnect() {
    const { address, isConnected, isReconnecting } = useAccount();
    const chainId = useChainId();
    const { switchChain, isPending: isSwitching } = useSwitchChain();
    const { disconnect } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { data: ensName } = useEnsName({ address });

    const [isNetOpen, setIsNetOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Identity Menu

    // Derived State
    const activeChain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    const isUnsupported = !activeChain && isConnected;

    // Formatting
    const formatAddress = (addr: string) => `${addr.slice(0, 5)}...${addr.slice(-4)}`;
    const displayName = ensName || (address ? formatAddress(address) : "");

    // Logic
    const handleConnect = () => {
        // Prefer injected (MetaMask/Rabby) or WalletConnect depending on availability
        const connector = connectors.find(c => c.id === 'injected') || connectors[0];
        if (connector) connect({ connector });
    };

    return (
        <div className="relative font-sans z-50">
            <AnimatePresence mode="wait">
                {!isConnected ? (
                    // 1. DISCONNECTED STATE: "INITIALIZE LINK"
                    <motion.button
                        key="connect-btn"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnect}
                        className="group relative px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] overflow-hidden"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

                        <div className="flex items-center gap-3 relative z-10 text-xs tracking-[0.15em] font-medium text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399] transition-all" />
                            {isReconnecting ? "INITIALIZING..." : "INITIALIZE LINK"}
                        </div>
                    </motion.button>
                ) : (
                    // 2. CONNECTED STATE: "COMMAND CENTER"
                    <motion.div
                        key="connected-capsule"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center p-1 rounded-full border backdrop-blur-xl shadow-2xl transition-colors duration-500 ${isUnsupported ? "bg-amber-900/20 border-amber-500/30" : "bg-black/20 border-white/10"
                            }`}
                    >
                        {/* A. NETWORK SEGMENT */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNetOpen(!isNetOpen)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-l-full hover:bg-white/5 transition-colors ${isUnsupported ? "text-amber-500" : "text-white/80"
                                    }`}
                            >
                                {isSwitching ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isUnsupported ? (
                                    <AlertTriangle className="w-4 h-4" />
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${activeChain?.color || "bg-gray-500"} shadow-[0_0_8px_currentColor]`} />
                                )}
                                <span className="text-[10px] font-bold tracking-wider uppercase hidden md:block">
                                    {isUnsupported ? "UNSUPPORTED" : activeChain?.short}
                                </span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${isNetOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* DROPDOWN */}
                            <AnimatePresence>
                                {isNetOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNetOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-3 w-48 p-1 rounded-xl bg-[#0a0a0c]/90 border border-white/10 backdrop-blur-2xl shadow-2xl z-50"
                                        >
                                            <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">
                                                Select Network
                                            </div>
                                            {SUPPORTED_CHAINS.map((chain) => (
                                                <button
                                                    key={chain.id}
                                                    onClick={() => {
                                                        switchChain({ chainId: chain.id });
                                                        setIsNetOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all group ${chainId === chain.id ? "bg-white/10" : "hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${chain.color} ${chainId === chain.id ? "shadow-[0_0_8px_currentColor]" : "opacity-30 group-hover:opacity-100"}`} />
                                                    <span className={`text-xs ${chainId === chain.id ? "text-white font-bold" : "text-white/60 group-hover:text-white"}`}>
                                                        {chain.name}
                                                    </span>
                                                    {chainId === chain.id && <div className="ml-auto w-1 h-1 rounded-full bg-white/50" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-white/10 mx-1" />

                        {/* B. IDENTITY SEGMENT */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 px-4 py-1.5 hover:opacity-80 transition-opacity"
                            >
                                <span className="font-serif text-sm text-white font-medium tracking-wide">
                                    {displayName}
                                </span>
                                {/* Generated Gradient Avatar */}
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 border border-white/20 shadow-inner" />
                            </button>

                            {/* IDENTITY MENU */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-40 p-1 rounded-xl bg-[#0a0a0c]/90 border border-white/10 backdrop-blur-2xl shadow-2xl z-50"
                                        >
                                            <button
                                                onClick={() => disconnect()}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                                            >
                                                <LogOut className="w-3 h-3" />
                                                Disconnect
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
