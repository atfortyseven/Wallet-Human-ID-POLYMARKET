"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect, useConnect, useEnsName } from "wagmi";
import { Copy, Check, LogOut, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toast } from "sonner";

interface WalletConnectProps {
    showGasless?: boolean;
}

export default function WalletConnect({ showGasless = false }: WalletConnectProps) {
    const { address, isConnected, isReconnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { data: ensName } = useEnsName({ address });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Formatting
    const formatAddress = (addr: string) => `${addr.slice(0, 5)}...${addr.slice(-4)}`;
    const displayName = ensName || (address ? formatAddress(address) : "");

    // Logic
    const handleConnect = () => {
        const connector = connectors.find(c => c.id === 'injected') || connectors[0];
        if (connector) connect({ connector });
    };

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success("Wallet address copied!", { position: "bottom-right" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative font-sans z-50">
            <AnimatePresence mode="wait">
                {!isConnected ? (
                    // 1. DISCONNECTED STATE: "INITIALIZE LINK"
                    <div className="flex flex-col items-center gap-3">
                        <motion.button
                            key="connect-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnect}
                            className="group relative px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] overflow-hidden"
                        >
                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                            <div className="flex items-center gap-3 relative z-10 text-xs tracking-[0.15em] font-medium text-white/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399] transition-all" />
                                {isReconnecting ? "INITIALIZING..." : "CONNECT WALLET"}
                            </div>
                        </motion.button>

                        {showGasless && (
                            <button className="text-[10px] text-white/30 hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                                Try Gasless Mode
                            </button>
                        )}
                    </div>
                ) : (
                    // 2. CONNECTED STATE: "IDENTITY CAPSULE"
                    <motion.div
                        key="connected-capsule"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group" // Group for hover logic
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <button
                            className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl transition-all group-hover:bg-black/40 group-hover:border-white/20"
                        >
                            <span className="font-serif text-sm text-white font-medium tracking-wide">
                                {displayName}
                            </span>
                            {/* Generated Gradient Avatar */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 border border-white/20 shadow-inner flex items-center justify-center">
                                <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                            </div>
                        </button>

                        {/* IDENTITY MENU (Hover) */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-64 p-3 rounded-2xl bg-[#0a0a0c]/95 border border-white/10 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    {/* Header: Avatar & Address */}
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 border border-white/20 shadow-inner" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white tracking-wide">{displayName}</span>
                                            <button
                                                onClick={handleCopy}
                                                className="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                                            >
                                                {formatAddress(address!)}
                                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Theme Toggle */}
                                    <div className="py-2">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1 mb-1">Theme</p>
                                        <ThemeToggle />
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 border-t border-white/5">
                                        <button
                                            onClick={() => disconnect()}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group/disconnect"
                                        >
                                            <LogOut className="w-3.5 h-3.5 group-hover/disconnect:scale-110 transition-transform" />
                                            Disconnect Wallet
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
