'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// RESTRICTED JURISDICTIONS (ISO Alpha-2)
const BLOCKED_COUNTRIES = ['US', 'KP', 'IR', 'CU', 'SY'];

export const GeoBlocker = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkJurisdiction = async () => {
            try {
                // Using local proxy to avoid CORS issues
                const res = await fetch('/api/geo');
                const data = await res.json();

                if (data && data.country_code && BLOCKED_COUNTRIES.includes(data.country_code)) {
                    setIsBlocked(true);
                    console.warn(`Access Restricted: Jurisdiction ${data.country_code} detected.`);
                }
            } catch (error) {
                console.error("Geo-Fencing Error:", error);
                // Fail-open or Fail-closed policy? Defaults to open for UX, strictly closed for legal.
            } finally {
                setLoading(false);
            }
        };

        checkJurisdiction();
    }, []);

    if (!isBlocked) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="max-w-md w-full glass p-8 border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center relative overflow-hidden rounded-xl">

                {/* Background Noise/Grid */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10"
                >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🚫</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Restricted</h2>
                    <p className="text-sm text-red-200/80 mb-8 font-mono leading-relaxed">
                        Protocol H-71 detects you are accessing from a Restricted Jurisdiction (USA/OFAC).
                        <br /><br />
                        Financial services are deactivated to comply with local regulations.
                    </p>

                    <div className="p-4 bg-black/40 rounded border border-white/5 text-xs text-[#666] font-mono">
                        ERR_CODE: GEO_FENCE_VIOLATION_0x99
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
