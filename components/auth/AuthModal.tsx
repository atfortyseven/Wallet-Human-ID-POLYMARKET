
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
    onAuthenticated: () => void;
}

type Step = 'email' | 'verify' | 'password';

export function AuthModal({ onAuthenticated }: AuthModalProps) {
    const [step, setStep] = useState<Step>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [userId, setUserId] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    // Step 1: Email Entry
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Check if email exists
            const checkResponse = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const checkData = await checkResponse.json();

            if (checkData.exists) {
                // Email exists - go directly to password (signin flow)
                setIsSignup(false);
                setStep('password');
                setIsLoading(false);
            } else {
                // Email doesn't exist - send verification code (signup flow)
                setIsSignup(true);
                const response = await fetch('/api/auth/send-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (!response.ok) {
                    setIsLoading(false);
                    toast.error(data.error || 'Failed to send code');
                    return;
                }

                setUserId(data.userId);
                setStep('verify');
                setIsLoading(false);
                toast.success('Verification code sent to your email');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('Network error. Please try again.');
        }
    };

    // Step 2: Verify Code (signup only)
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                toast.error(data.error || 'Invalid code');
                return;
            }

            setStep('password');
            setIsLoading(false);
            toast.success('Email verified!');
        } catch (error) {
            setIsLoading(false);
            toast.error('Network error. Please try again.');
        }
    };

    // Step 3: Password Entry/Creation
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignup) {
                // Complete signup
                const response = await fetch('/api/auth/complete-signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name })
                });

                const data = await response.json();

                if (!response.ok) {
                    setIsLoading(false);
                    toast.error(data.error || 'Signup failed');
                    return;
                }

                localStorage.setItem('auth_token', data.token);
                setIsLoading(false);
                toast.success('Account created!');
                onAuthenticated();
            } else {
                // Sign in
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    setIsLoading(false);
                    toast.error(data.error || 'Invalid credentials');
                    return;
                }

                localStorage.setItem('auth_token', data.token);
                setIsLoading(false);
                toast.success('Welcome back!');
                onAuthenticated();
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('Network error. Please try again.');
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden text-neutral-900 border border-neutral-100"
            >
                {/* Header */}
                <div className="pt-10 pb-2 px-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 text-white shadow-blue-200 shadow-lg">
                        <Lock size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                        {step === 'email' && 'Welcome to HumanDefi'}
                        {step === 'verify' && 'Check your email'}
                        {step === 'password' && (isSignup ? 'Create password' : 'Enter password')}
                    </h2>
                    <p className="text-neutral-500 text-sm mt-2">
                        {step === 'email' && 'Enter your email to continue'}
                        {step === 'verify' && `We sent a code to ${email}`}
                        {step === 'password' && (isSignup ? 'Almost done! Set your password' : 'Welcome back')}
                    </p>
                </div>

                <div className="p-10 pt-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Email */}
                        {step === 'email' && (
                            <motion.form 
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleEmailSubmit}
                                className="space-y-5"
                            >
                                {/* PRIMARY: Google Sign-In */}
                                <button 
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
                                >
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 bg-white rounded p-0.5" alt="Google" />
                                    Continue with Google
                                </button>

                                <div className="relative py-3">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase font-bold"><span className="bg-white px-4 text-neutral-400">Or use email</span></div>
                                </div>

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

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-neutral-200"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
                                </button>
                            </motion.form>
                        )}

                        {/* Step 2: Verify Code */}
                        {step === 'verify' && (
                            <motion.form 
                                key="verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyCode}
                                className="space-y-6"
                            >
                                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                                    <Smartphone className="mx-auto text-blue-600 mb-2" size={32} />
                                    <p className="text-sm text-blue-800 font-medium">
                                        Check your inbox for the <br/>
                                        <span className="font-bold">6-digit code</span>
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
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Verify"}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setStep('email')}
                                    className="w-full text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Back to email
                                </button>
                            </motion.form>
                        )}

                        {/* Step 3: Password */}
                        {step === 'password' && (
                            <motion.form 
                                key="password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handlePasswordSubmit}
                                className="space-y-5"
                            >
                                {isSignup && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Name</label>
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                placeholder="Your name"
                                            />
                                            <User size={18} className="absolute right-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                )}

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
                                            autoFocus
                                        />
                                        <Lock size={18} className="absolute right-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    {isSignup && (
                                        <p className="text-xs text-neutral-400 ml-1">Min 8 chars, uppercase, lowercase, number</p>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-neutral-200"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : (isSignup ? "Create Account" : "Sign In")}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setStep('email')}
                                    className="w-full text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Back to email
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
