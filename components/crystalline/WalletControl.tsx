"use client";

import { useAccount, useDisconnect, useBalance, useConnect } from "wagmi";
import { useState } from "react";
import { Copy, Check, LogOut, Wallet, ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Inline formatter since not in utils yet
const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export function WalletControl() {
    const { address, isConnected, chain } = useAccount();
    const { disconnect } = useDisconnect();
    const { connectors, connect } = useConnect();
    const { data: balance } = useBalance({ address });

    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
                {connectors.slice(0, 2).map((connector) => (
                    <button
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all ml-1 first:ml-0"
                    >
                        {connector.name}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-inner">
                    <Wallet size={14} />
                </div>

                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white">
                        {address ? formatAddress(address) : ''}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {balance ? `${parseFloat(balance.formatted).toFixed(2)} ${balance.symbol}` : '...'}
                    </span>
                </div>

                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-72 z-50 p-4 rounded-2xl border border-white/10 bg-[#0D0D12]/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/50"
                        >
                            {/* Header Info */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tu Billetera</span>
                                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                    {chain?.name || 'Polygon'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={copyAddress}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:text-blue-300">
                                            <Copy size={16} />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium text-gray-200">Copiar Dirección</span>
                                            <span className="text-[10px] text-gray-500">{address ? formatAddress(address) : ''}</span>
                                        </div>
                                    </div>
                                    {copied ? <Check size={16} className="text-green-400" /> : null}
                                </button>

                                <a
                                    href={`https://polygonscan.com/address/${address}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-purple-300">
                                            <ExternalLink size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-200">Ver en Explorador</span>
                                    </div>
                                </a>
                            </div>

                            {/* Disconnect */}
                            <button
                                onClick={() => disconnect()}
                                className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors border border-transparent hover:border-red-500/30"
                            >
                                <LogOut size={16} />
                                <span>Desconectar</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
