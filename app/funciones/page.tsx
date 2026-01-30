
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { Shield, Zap, Globe, Lock, Coins, Vote } from 'lucide-react';

export default function FuncionesPage() {
    
    const features = [
        {
            icon: <Shield size={32} className="text-emerald-400" />,
            title: "Sovereign Identity",
            desc: "World ID integration ensures one-person-one-vote without revealing personal data. Your biometrics never leave your device."
        },
        {
            icon: <Zap size={32} className="text-yellow-400" />,
            title: "Instant Zaps",
            desc: "Convert WLD to investment positions in one click. Our smart routers find the best path across Uniswap and obscure DEXs."
        },
        {
            icon: <Vote size={32} className="text-purple-400" />,
            title: "Democratic Governance",
            desc: "Create and vote on market proposals. The protocol is owned by the users, not VCs. Your voice matters."
        },
        {
            icon: <Coins size={32} className="text-blue-400" />,
            title: "Yield Vaults",
            desc: "Automated strategies optimized for risk-adjusted returns. Earn passive income on your dormant assets."
        },
        {
            icon: <Lock size={32} className="text-red-400" />,
            title: "Armored Security",
            desc: "Session hijacking protection, auto-logout, and strict biometric re-verification for high-value transactions."
        },
        {
            icon: <Globe size={32} className="text-cyan-400" />,
            title: "Global Access",
            desc: "Uncensored access to prediction markets. No geoblocking on the protocol level. You are a citizen of the world."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F0] text-[#1F1F1F] font-sans selection:bg-[#1F1F1F] selection:text-[#F5F5F0] flex flex-col">
            <SiteHeader />
            
            <main className="flex-grow">
                {/* Hero */}
                <section className="pt-32 pb-12 px-6 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
                    >
                        SYSTEM CORE
                    </motion.h1>
                    <p className="max-w-xl mx-auto text-xl text-neutral-500 font-medium">
                        A detailed breakdown of the machinery powering your financial freedom.
                    </p>
                </section>

                <section className="py-12 bg-[#1F1F1F] text-white my-12 relative overflow-hidden">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                     <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <div className="mb-8 px-12">
                        <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2">Visual Intelligence</h2>
                        <p className="text-2xl font-bold">System Visualizations</p>
                        <p className="text-sm text-neutral-400 mt-4 max-w-2xl">Interactive components coming soon. Explore the features below for a detailed system breakdown.</p>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="px-6 py-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-[2rem] bg-white border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6 text-neutral-900 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                                <p className="text-neutral-500 leading-relaxed font-medium text-lg">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
                
                 {/* "Tech Specs" footer-like section */}
                 <section className="px-6 py-20 text-center border-t border-neutral-200 bg-white">
                    <div className="inline-block border border-neutral-200 rounded-full px-6 py-2 text-sm font-mono text-neutral-400 mb-8">
                        v2.4.0-alpha
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Open Source & Audited</h2>
                    <p className="max-w-2xl mx-auto text-neutral-500 mb-8">
                        Our smart contracts are verified on Etherscan and our frontend is fully open source. 
                        Verify, don't trust.
                    </p>
                    <a href="https://github.com/humanid-fi" target="_blank" className="font-bold border-b-2 border-black hover:bg-black hover:text-white transition-all">
                        View Source Code
                    </a>
                </section>

            </main>
            
            <div className="p-6">
                 <HumanDefiFooter />
            </div>
        </div>
    );
}
