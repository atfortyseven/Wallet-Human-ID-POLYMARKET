"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, QrCode as QrIcon, Check } from "lucide-react";
import { useAccount } from "wagmi";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface ReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
    const { address } = useAccount();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success("Address copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none p-4"
                    >
                        <div className="w-full max-w-sm bg-[#1a1b23]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <QrIcon className="w-5 h-5 text-emerald-400" />
                                    Receive Assets
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 flex flex-col items-center space-y-8">

                                {/* QR Code Container */}
                                <div className="p-4 bg-white rounded-2xl shadow-xl shadow-emerald-500/10">
                                    {address ? (
                                        <QRCodeSVG
                                            value={address}
                                            size={200}
                                            level="M"
                                            bgColor="#FFFFFF"
                                            fgColor="#000000"
                                        />
                                    ) : (
                                        <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-xl" />
                                    )}
                                </div>

                                <div className="space-y-4 w-full text-center">
                                    <p className="text-white/60 text-sm">
                                        Scan this QR code to deposit funds
                                        <br />
                                        <span className="text-emerald-400 font-medium">Polygon Network (Matic)</span>
                                    </p>

                                    {/* Address Display */}
                                    {address && (
                                        <div
                                            onClick={handleCopy}
                                            className="group cursor-pointer relative py-3 px-4 bg-black/30 border border-white/10 hover:border-emerald-500/50 hover:bg-black/40 rounded-xl transition-all"
                                        >
                                            <p className="font-mono text-white/90 text-sm truncate px-8">
                                                {address}
                                            </p>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-emerald-400 transition-colors">
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
