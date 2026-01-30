
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, Mail, ArrowRight, X, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
    onAuthenticated: () => void;
}

export function AuthModal({ onAuthenticated }: AuthModalProps) {
    const [step, setStep] = useState<'login' | 'verify'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsLoading(false);
        setStep('verify');
        toast.info("Security code sent to your device.");
    };

    const handleVerify = async (code: string) => {
        if(code.length === 6) {
             setIsLoading(true);
             // Simulate Verification
             await new Promise(r => setTimeout(r, 1000));
             setIsLoading(false);
             toast.success("Identity Confirmed. Access Granted.");
             onAuthenticated();
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {/* AMBIENT BACKGROUND - "Geometric Polymer" Vibe */}
            <div className="absolute inset-0 bg-[#0A0A0F]">
                 <div className="absolute inset-0 bg-[url('/assets/grid-noise.png')] opacity-20 mix-blend-overlay" />
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="p-8 relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(120,0,255,0.2)]">
                            <Shield size={32} className="text-purple-300" />
                        </div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {step === 'login' ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
                                    <p className="text-white/40 text-sm">Enter your credentials to decrypt the dashboard.</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-purple-300 uppercase tracking-widest pl-1">Email Identity</label>
                                        <div className="relative">
                                            <input 
                                                type="email" 
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                                placeholder="human@geometry.fi"
                                            />
                                            <Mail className="absolute right-4 top-3.5 text-white/20" size={18} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-purple-300 uppercase tracking-widest pl-1">Passphrase</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                required
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                                placeholder="••••••••••••"
                                            />
                                            <Lock className="absolute right-4 top-3.5 text-white/20" size={18} />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        {isLoading ? "Encrypting..." : "Initiate Sequence"}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0f13] px-2 text-white/30">Or connect with</span></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-white/5 border border-white/5 hover:bg-white/10 py-2.5 rounded-xl text-white font-medium transition-colors text-sm">
                                        Google
                                    </button>
                                    <button className="bg-white/5 border border-white/5 hover:bg-white/10 py-2.5 rounded-xl text-white font-medium transition-colors text-sm">
                                        X (Twitter)
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 text-center"
                            >
                                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Smartphone className="text-purple-300" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">2FA Verification</h2>
                                    <p className="text-white/40 text-sm">Enter the code sent to your device to finalize handshake.</p>
                                </div>

                                <input 
                                    type="text" 
                                    maxLength={6}
                                    placeholder="000000"
                                    onChange={(e) => handleVerify(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                                    autoFocus
                                />

                                <button onClick={() => setStep('login')} className="text-white/40 hover:text-white text-sm transition-colors">
                                    Cancel Authentication
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
