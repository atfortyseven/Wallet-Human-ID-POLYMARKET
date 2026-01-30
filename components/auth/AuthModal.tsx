
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Smartphone, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
    onAuthenticated: () => void;
}

export function AuthModal({ onAuthenticated }: AuthModalProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [step, setStep] = useState<'credentials' | 'verify'>('credentials');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulating Backend Latency
        await new Promise(r => setTimeout(r, 2000));
        
        setIsLoading(false);
        setStep('verify');
        toast.success(`Verification code sent to ${email}`);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating Verification Check
        await new Promise(r => setTimeout(r, 1500));
        
        if (code === '123456' || code.length === 6) {
            setIsLoading(false);
            toast.success("Identity Verified");
            onAuthenticated();
        } else {
            setIsLoading(false);
            toast.error("Invalid code. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden text-neutral-900 border border-neutral-100"
            >
                {/* Header Brand */}
                <div className="pt-10 pb-2 px-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 text-white shadow-blue-200 shadow-lg">
                        <Lock size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                        {step === 'credentials' 
                            ? (mode === 'signin' ? "Welcome back" : "Create account") 
                            : "Verify it's you"}
                    </h2>
                    <p className="text-neutral-500 text-sm mt-2">
                         {step === 'credentials' 
                            ? "Enter your details to access the Human Defi Protocol." 
                            : `We've sent a 6-digit code to ${email}`}
                    </p>
                </div>

                <div className="p-10 pt-6">
                    <AnimatePresence mode="wait">
                        {step === 'credentials' ? (
                            <motion.form 
                                key="credentials"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit} 
                                className="space-y-5"
                            >
                                {mode === 'signup' && (
                                     <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                placeholder="John Doe"
                                            />
                                            <User size={18} className="absolute right-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Email</label>
                                    <div className="relative group">
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            placeholder="name@example.com"
                                        />
                                        <Mail size={18} className="absolute right-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Password</label>
                                    <div className="relative group">
                                        <input 
                                            type="password" 
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                        <Lock size={18} className="absolute right-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-neutral-200"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? "Sign In" : "Create Account")}
                                </button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase font-bold"><span className="bg-white px-3 text-neutral-400">Or continue with</span></div>
                                </div>

                                <button type="button" className="w-full bg-white border border-neutral-200 text-neutral-700 font-bold py-3.5 rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                    Google Account
                                </button>

                            </motion.form>
                        ) : (
                            <motion.form 
                                key="verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerify}
                                className="space-y-6"
                            >
                                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                                    <Smartphone className="mx-auto text-blue-600 mb-2" size={32} />
                                    <p className="text-sm text-blue-800 font-medium">
                                        We sent a secure code to <br/>
                                        <span className="font-bold">{email}</span>
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Verification Code</label>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-neutral-900"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading || code.length < 6}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setStep('credentials')}
                                    className="w-full text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Back to login
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Footer Toggle */}
                {step === 'credentials' && (
                    <div className="bg-neutral-50 p-6 text-center border-t border-neutral-100">
                        <p className="text-sm text-neutral-500 font-medium">
                            {mode === 'signin' ? "New to Human Defi? " : "Already have an account? "}
                            <button 
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors"
                            >
                                {mode === 'signin' ? "Create an account" : "Sign in"}
                            </button>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
