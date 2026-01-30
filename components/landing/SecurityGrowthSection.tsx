"use client";

import React from 'react';
import { Lock, ShieldCheck, Key, Eye, TrendingUp, Briefcase, Globe, Award } from 'lucide-react';

export function SecurityGrowthSection() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 pb-32">
            
            {/* Center Text Interlude */}
            {/* Center Text Interlude with Background */}
            <div className="py-32 flex flex-col items-center justify-center text-center relative rounded-3xl overflow-hidden my-20">
                {/* Background Image: 'fondoparaseguridad' */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/models/fondoparaseguridad.jpg" 
                        alt="Security Background" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5DC] via-transparent to-[#F5F5DC]" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-ty from-black/20 to-transparent tracking-tighter opacity-50">
                        MÁXIMA
                    </h2>
                    <h2 className="text-6xl md:text-9xl font-black text-indigo-900 tracking-widest mt-[-20px] md:mt-[-40px] drop-shadow-2xl">
                        SEGURIDAD
                    </h2>
                </div>
            </div>

            {/* 4 Cards: Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
                {[
                    { title: "Non-Custodial", icon: <Lock />, desc: "Tú tienes el control total de tus claves." },
                    { title: "Auditada", icon: <ShieldCheck />, desc: "Smart contracts verificados por líderes." },
                    { title: "Biometría", icon: <Key />, desc: "Acceso protegido por Human ID." },
                    { title: "Privacidad", icon: <Eye />, desc: "Tus datos nunca salen de tu dispositivo." }
                ].map((card, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="mb-4 text-blue-400">{card.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-white/60 text-sm">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* 4 Cards: Growth ($250M Investment) */}
            <h3 className="text-3xl font-bold text-white mb-8 pl-4 border-l-4 border-blue-500">Crecimiento Exponencial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "$250M Inversión", icon: <Briefcase />, desc: "Respaldados por fondos tier-1." },
                    { title: "+1M Usuarios", icon: <Globe />, desc: "Comunidad global activa." },
                    { title: "Top 3 DeFi", icon: <TrendingUp />, desc: "Líderes en volumen on-chain." },
                    { title: "Premiados", icon: <Award />, desc: "Mejor Wallet Web3 2025." }
                ].map((card, i) => (
                    <div key={i} className="bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20 p-6 rounded-2xl">
                        <div className="mb-4 text-green-400">{card.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-white/60 text-sm">{card.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
