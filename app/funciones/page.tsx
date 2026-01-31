'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { Shield, Zap, Globe, Lock, Coins, Vote } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';

export default function FuncionesPage() {
    const { t } = useLanguage();
    
    const features = [
        {
            icon: <Shield size={32} className="text-emerald-400" />,
            title: t('features.id.title'),
            desc: t('features.id.desc')
        },
        {
            icon: <Zap size={32} className="text-yellow-400" />,
            title: t('features.zap.title'),
            desc: t('features.zap.desc')
        },
        {
            icon: <Vote size={32} className="text-purple-400" />,
            title: t('features.gov.title'),
            desc: t('features.gov.desc')
        },
        {
            icon: <Coins size={32} className="text-blue-400" />,
            title: t('features.yield.title'),
            desc: t('features.yield.desc')
        },
        {
            icon: <Lock size={32} className="text-red-400" />,
            title: t('features.security.title'),
            desc: t('features.security.desc')
        },
        {
            icon: <Globe size={32} className="text-cyan-400" />,
            title: t('features.global.title'),
            desc: t('features.global.desc')
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
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase"
                    >
                        {t('features.title')}
                    </motion.h1>
                    <p className="max-w-xl mx-auto text-xl text-neutral-500 font-medium">
                        {t('features.subtitle')}
                    </p>
                </section>

                <section className="py-12 bg-[#1F1F1F] text-white my-12 relative overflow-hidden">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                     <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <div className="mb-8 px-12">
                        <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2">{t('features.visual_intel')}</h2>
                        <p className="text-2xl font-bold">{t('features.visual_desc')}</p>
                        <p className="text-sm text-neutral-400 mt-4 max-w-2xl">{t('features.visual_note')}</p>
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
                    <h2 className="text-3xl font-bold mb-4">{t('features.footer.title')}</h2>
                    <p className="max-w-2xl mx-auto text-neutral-500 mb-8">
                        {t('features.footer.desc')}
                    </p>
                    <a href="https://github.com/humanid-fi" target="_blank" className="font-bold border-b-2 border-black hover:bg-black hover:text-white transition-all uppercase tracking-widest px-1">
                        {t('features.footer.cta')}
                    </a>
                </section>

            </main>
            
            <div className="p-6">
                 <HumanDefiFooter />
            </div>
        </div>
    );
}
