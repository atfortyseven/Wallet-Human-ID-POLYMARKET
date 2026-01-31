'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';

export default function SoportePage() {
    const [message, setMessage] = useState('');
    const [section, setSection] = useState('general');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!message.trim()) return;

        setIsSending(true);

        try {
            const response = await fetch('/api/support', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, section }) 
            });

            if (!response.ok) throw new Error('Failed to send');
            
            setSent(true);
            toast.success("Message received by the Void.");
            setMessage('');
            
            // Auto reset after 3 seconds
            setTimeout(() => setSent(false), 3000);

        } catch (error) {
            console.error(error);
            toast.error("Failed to transmit to the Void.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans selection:bg-[#1F1F1F] selection:text-[#EAEADF] flex flex-col">
            <SiteHeader />
            
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Noise/Void Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black rounded-full blur-[120px]" />
                </div>

                <div className="w-full max-w-2xl relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-[#1F1F1F]">
                            THE VOID
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-[#1F1F1F]/60 max-w-lg mx-auto leading-relaxed">
                            Speak your truth. We are listening in real-time.
                        </p>
                    </motion.div>

                    <motion.form 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="bg-white/50 backdrop-blur-xl border border-white/40 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group"
                    >
                         {/* Selection Chips */}
                         <div className="flex justify-center gap-2 mb-6 flex-wrap">
                            {['General', 'Technical', 'Governance', 'Other'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSection(s.toLowerCase())}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${section === s.toLowerCase() ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]' : 'bg-transparent text-[#1F1F1F]/40 border-[#1F1F1F]/10 hover:border-[#1F1F1F]/30'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message to the system..."
                                className="w-full h-40 bg-transparent text-xl md:text-2xl font-medium placeholder:text-[#1F1F1F]/20 resize-none outline-none text-center align-middle"
                                style={{
                                    caretColor: '#1F1F1F'
                                }}
                            />
                            
                            <AnimatePresence>
                                {sent && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-2xl"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                                                <Send size={20} />
                                            </div>
                                            <span className="font-bold text-[#1F1F1F]">Transmitted</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button 
                                type="submit"
                                disabled={isSending || !message.trim()}
                                className="
                                    group relative px-8 py-4 bg-[#1F1F1F] text-[#EAEADF] rounded-full font-bold text-lg 
                                    hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                    shadow-lg hover:shadow-2xl overflow-hidden
                                "
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isSending ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />}
                                    {isSending ? 'Transmitting...' : 'Send into the Void'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </button>
                        </div>
                    </motion.form>

                    <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-300">
                         <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest border border-[#1F1F1F]/20 px-3 py-1 rounded-full">
                            <Info size={12} />
                            Zero-knowledge Support Protocol Active
                        </div>
                    </div>

                </div>
            </main>
            <Toaster position="bottom-center" />
            
            <div className="p-6">
                 <HumanDefiFooter />
            </div>
        </div>
    );
}
