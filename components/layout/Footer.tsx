import React from 'react';
import { SecurityShield } from '@/components/security/SecurityShield';

export const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-20">
            <div className="max-w-[1440px] mx-auto px-5 py-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">

                {/* Brand */}
                <div className="text-center md:text-left">
                    <h5 className="text-xl font-bold text-white tracking-tight">Humanid.fi</h5>
                    <p className="text-xs text-[#888899] mt-2 font-mono">
                        Sovereign Intelligence & Financial Layer. <br />
                        Built on Base Sepolia.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-8 text-sm text-[#888899]">
                    <a href="https://docs.humanid.fi" target='_blank' rel='noreferrer' className="hover:text-[#00f2ea] transition-colors">Documentation</a>
                    <a href="#" className="hover:text-[#00f2ea] transition-colors">Protocol</a>
                    <a href="#" className="hover:text-[#00f2ea] transition-colors">Security</a>
                    <a href="#" className="hover:text-[#00f2ea] transition-colors">Governance</a>
                </div>

                {/* Status */}
                <div className="flex items-center gap-4">
                    <SecurityShield />
                    <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff9d]"></span>
                        </span>
                        <span className="text-xs font-mono text-[#00ff9d] tracking-wider">SYSTEM OPTIMAL</span>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/5 py-4 text-center">
                <p className="text-[10px] text-[#444] font-mono uppercase">
                    © 2024 Humanid.fi Org. All Rights Reserved. Non-Custodial Output.
                </p>
            </div>
        </footer>
    );
};
