"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useSocialHub } from "@/hooks/useSocialHub";

interface TipButtonProps {
    traderName: string;
    traderAddress: string;
}

export default function TipButton({ traderName, traderAddress }: TipButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [isPending, setIsPending] = useState(false); // Local loading state
    const { sendTip } = useSocialHub();

    const handleTip = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        setIsPending(true);
        try {
            await sendTip(traderAddress, amount);
            toast.success(`Tipped ${amount} USDC to ${traderName}!`);
            setIsOpen(false);
            setAmount("");
        } catch (error: any) {
            toast.error("Failed to send tip");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition-all hover:scale-105"
                title={`Tip ${traderName}`}
            >
                <Coins className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0a0a0c] border border-white/10 p-6 rounded-3xl shadow-2xl z-50"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Tip {traderName}</h3>
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-white/50 mb-4">
                                Support this trader with USDC. Protocol fee: 5%.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-wider block mb-2">Amount (USDC)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {[1, 5, 10].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val.toString())}
                                            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-white/70 transition-colors"
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleTip}
                                    disabled={isPending || !amount}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Coins className="w-5 h-5" />}
                                    {isPending ? "Processing..." : "Send Tip"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
