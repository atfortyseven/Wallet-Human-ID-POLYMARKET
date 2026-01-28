'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BootSequence = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("INITIALIZING SECURE ENCLAVE...");

    useEffect(() => {
        // Check session to run only once
        const hasBooted = sessionStorage.getItem('humanid_booted_v1');
        if (hasBooted) {
            setIsVisible(false);
            return;
        }

        // Sequence Logic
        const duration = 2500; // ms
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const percent = Math.min(100, Math.floor((currentStep / steps) * 100));
            setProgress(percent);

            // Dynamic Status Updates
            if (percent > 20 && percent < 40) setStatus("VERIFYING BIOMETRIC HASH...");
            if (percent > 40 && percent < 70) setStatus("SYNCING WITH BASE SEPOLIA...");
            if (percent > 70 && percent < 90) setStatus("DECRYPTING INTEL FEED...");
            if (percent >= 90) setStatus("ACCESS GRANTED");

            if (currentStep >= steps) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsVisible(false);
                    sessionStorage.setItem('humanid_booted_v1', 'true');
                }, 400);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono select-none"
                    style={{ cursor: 'wait' }}
                >
                    {/* Matrix/Grid Background Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,234,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                    <div className="relative z-10 w-[300px] md:w-[400px]">
                        {/* Logo / Glitch Effect */}
                        <motion.h1
                            animate={{ opacity: [0.8, 1, 0.8], x: [-1, 1, -1] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="text-4xl md:text-5xl font-bold text-center mb-8 text-white tracking-tighter"
                        >
                            HUMANID<span className="text-[#00f2ea]">.FI</span>
                        </motion.h1>

                        {/* Progress Bar Container */}
                        <div className="h-1 w-full bg-[#111] rounded overflow-hidden mb-2 border border-[#333]">
                            <motion.div
                                className="h-full bg-[#00f2ea] shadow-[0_0_15px_#00f2ea]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Status Text */}
                        <div className="flex justify-between text-[10px] md:text-xs text-[#00f2ea] uppercase tracking-widest">
                            <span>{status}</span>
                            <span>{progress}%</span>
                        </div>
                    </div>

                    {/* Footer Tech Check */}
                    <div className="absolute bottom-10 text-[0.6rem] text-[#444] text-center">
                        <p>PROTOCOL V2.4.1 // NON-FIDUCIARY STANDARD</p>
                        <p className="mt-1">ENCRYPTED VIA WORLD_ID</p>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
