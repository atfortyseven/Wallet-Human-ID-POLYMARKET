'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export const TermsGate = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Check local storage for consent
        const hasConsented = localStorage.getItem('humanid_terms_v1');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('humanid_terms_v1', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-lg w-full glass border border-white/10 p-8 rounded-2xl relative overflow-hidden"
            >
                {/* Warning Header */}
                <div className="flex items-center gap-3 mb-6 text-yellow-500">
                    <ShieldAlert size={32} />
                    <h2 className="text-xl font-bold tracking-tight text-white">JURIDICAL CHECKPOINT</h2>
                </div>

                <div className="prose prose-invert text-sm text-[#888899] font-mono mb-8 max-h-[40vh] overflow-y-auto pr-2">
                    <p>
                        By accessing <strong>Humanid.fi</strong> (The Protocol), you acknowledge and attest to the following:
                    </p>
                    <ul className="list-disc pl-4 space-y-2 mt-2">
                        <li>You are <strong>NOT</strong> a citizen or resident of the United States, North Korea, Iran, or any OFAC-sanctioned jurisdiction.</li>
                        <li>You understand that this is a <strong>Simulation & Testnet Environment</strong> (Base Sepolia). No real assets are at risk, but no guarantees are made.</li>
                        <li>You are accessing this software as a Sovereign Individual, responsible for your own compliance.</li>
                    </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                            <div className="w-5 h-5 border-2 border-[#444] rounded peer-checked:bg-[#00f2ea] peer-checked:border-[#00f2ea] transition-all"></div>
                        </div>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            I attest I am compliant with the above Manifesto.
                        </span>
                    </label>

                    <button
                        disabled={!checked}
                        onClick={handleAccept}
                        className={`w-full mt-6 py-4 rounded-lg font-bold uppercase tracking-widest transition-all ${checked
                                ? 'bg-[#00f2ea] text-black hover:bg-[#00c2bb] shadow-[0_0_20px_rgba(0,242,234,0.4)]'
                                : 'bg-white/5 text-[#444] cursor-not-allowed'
                            }`}
                    >
                        Enter The Void
                    </button>
                </div>

            </motion.div>
        </div>
    );
};
