'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const SecurityShield = () => {
    // Determine if we are on HTTPS (Secure Context)
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

    return (
        <div className="flex items-center gap-2 group cursor-help">
            <div className={`p-1.5 rounded-full border ${isSecure ? 'border-[#00ff9d]/30 bg-[#00ff9d]/5' : 'border-red-500/30 bg-red-500/5'}`}>
                {isSecure ? (
                    <ShieldCheck size={14} className="text-[#00ff9d]" />
                ) : (
                    <Lock size={14} className="text-red-500" />
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#888899] group-hover:text-white transition-colors">
                    Security Level
                </span>
                <span className={`text-[10px] font-mono tracking-widest ${isSecure ? 'text-[#00ff9d]' : 'text-red-500'}`}>
                    {isSecure ? 'CITADEL: ACTIVE' : 'UNSECURE CONNECTION'}
                </span>
            </div>

            {/* Tooltip Effect */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-10 bg-black/90 border border-white/10 p-2 rounded text-[10px] text-gray-400 pointer-events-none whitespace-nowrap backdrop-blur-md">
                Protocol Hardened // EIP-712 // 2FA
            </div>
        </div>
    );
};
