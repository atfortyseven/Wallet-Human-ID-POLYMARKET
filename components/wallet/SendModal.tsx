"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowRight, Wallet, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useSendTransaction, useWriteContract, useEstimateGas, useBalance, useAccount } from "wagmi";
import { parseEther, parseUnits, isAddress, formatEther, formatUnits } from "viem";
import { toast } from "sonner";

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

// ERC20 ABI for transfer
const ERC20_ABI = [
    {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "recipient", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bool" }]
    }
] as const;

export default function SendModal({ isOpen, onClose }: SendModalProps) {
    const { address } = useAccount();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [asset, setAsset] = useState<"POL" | "USDC">("POL");

    // Status tracking
    const [status, setStatus] = useState<"IDLE" | "ESTIMATING" | "SIGNING" | "SENDING" | "SUCCESS">("IDLE");
    const [txHash, setTxHash] = useState("");

    // Wagmi Hooks
    const {
        sendTransaction,
        isPending: isSendingNative,
        isSuccess: isNativeSuccess,
        data: nativeTxData,
        error: nativeError
    } = useSendTransaction();

    const {
        writeContract,
        isPending: isWritingToken,
        isSuccess: isTokenSuccess,
        data: tokenTxData,
        error: tokenError
    } = useWriteContract();

    // Balances
    const { data: polBalance } = useBalance({ address });
    const { data: usdcBalance } = useBalance({ address, token: USDC_ADDRESS });

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setStatus("IDLE");
            setRecipient("");
            setAmount("");
            setTxHash("");
        }
    }, [isOpen]);

    // Handle Success/Error side effects
    useEffect(() => {
        if (isNativeSuccess && nativeTxData) {
            setStatus("SUCCESS");
            setTxHash(nativeTxData);
            toast.success("Transaction Sent!");
        }
        if (isTokenSuccess && tokenTxData) {
            setStatus("SUCCESS");
            setTxHash(tokenTxData);
            toast.success("Transaction Sent!");
        }
    }, [isNativeSuccess, isTokenSuccess, nativeTxData, tokenTxData]);

    useEffect(() => {
        if (nativeError) {
            setStatus("IDLE");
            toast.error(nativeError.message.split('\n')[0] || "Transaction failed");
        }
        if (tokenError) {
            setStatus("IDLE");
            toast.error(tokenError.message.split('\n')[0] || "Transaction failed");
        }
    }, [nativeError, tokenError]);


    const handleMax = () => {
        if (asset === "POL" && polBalance) {
            // Leave 0.01 POL for gas
            const val = parseFloat(formatEther(polBalance.value)) - 0.01;
            setAmount(val > 0 ? val.toFixed(4) : "0");
        } else if (asset === "USDC" && usdcBalance) {
            setAmount(formatUnits(usdcBalance.value, usdcBalance.decimals));
        }
    };

    const handleSend = async () => {
        if (!isAddress(recipient)) {
            toast.error("Invalid recipient address");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount");
            return;
        }

        setStatus("SIGNING");

        try {
            if (asset === "POL") {
                sendTransaction({
                    to: recipient,
                    value: parseEther(amount)
                });
            } else {
                writeContract({
                    address: USDC_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: "transfer",
                    args: [recipient, parseUnits(amount, 6)]
                });
            }
        } catch (e) {
            setStatus("IDLE");
            console.error(e);
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
                        <div className="w-full max-w-md bg-[#1a1b23]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Send className="w-5 h-5 text-indigo-400" />
                                    Send Assets
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {status === "SUCCESS" ? (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Sent!</h3>
                                        <p className="text-white/60">Your transaction has been submitted to the network.</p>
                                        <a
                                            href={`https://polygonscan.com/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
                                        >
                                            View on Explorer <ArrowRight className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Asset Selector */}
                                        <div className="flex bg-black/20 p-1 rounded-xl">
                                            <button
                                                onClick={() => setAsset("POL")}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${asset === "POL" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                                                    }`}
                                            >
                                                POL
                                            </button>
                                            <button
                                                onClick={() => setAsset("USDC")}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${asset === "USDC" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                                                    }`}
                                            >
                                                USDC
                                            </button>
                                        </div>

                                        {/* Recipient */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Recipient Address</label>
                                            <div className="relative">
                                                <input
                                                    value={recipient}
                                                    onChange={(e) => setRecipient(e.target.value)}
                                                    placeholder="0x..."
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm"
                                                />
                                                {recipient && isAddress(recipient) && (
                                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Amount</label>
                                                <span className="text-xs text-white/40">
                                                    Balance: {asset === "POL"
                                                        ? `${polBalance ? formatEther(polBalance.value).slice(0, 6) : "0.00"}`
                                                        : `${usdcBalance ? formatUnits(usdcBalance.value, usdcBalance.decimals) : "0.00"}`
                                                    } {asset}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-20 text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <button
                                                        onClick={handleMax}
                                                        className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-xs font-bold text-indigo-300 transition-colors"
                                                    >
                                                        MAX
                                                    </button>
                                                    <span className="font-bold text-white/50 text-sm">{asset}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            disabled={status === "SIGNING" || status === "SENDING" || !amount || !recipient}
                                            onClick={handleSend}
                                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {status === "SIGNING" || status === "SENDING" ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {status === "SIGNING" ? "Check Wallet..." : "Sending..."}
                                                </>
                                            ) : (
                                                <>
                                                    Send Assets <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
