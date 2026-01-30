"use client";

import React from 'react';
import LottieCard from '../ui/LottieCard';
import dynamic from 'next/dynamic';

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

            {/* 4 Cards: Security with Lottie Animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
                <LottieCard
                    lottieSrc="https://lottie.host/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/LockSecure.lottie"
                    title="Non-Custodial"
                    subtitle="Tú tienes el control total de tus claves."
                    lottieSize="md"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e/ShieldCheck.lottie"
                    title="Auditada"
                    subtitle="Smart contracts verificados por líderes."
                    lottieSize="md"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f/Fingerprint.lottie"
                    title="Biometría"
                    subtitle="Acceso protegido por Human ID."
                    lottieSize="md"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a/PrivacyEye.lottie"
                    title="Privacidad"
                    subtitle="Tus datos nunca salen de tu dispositivo."
                    lottieSize="md"
                />
            </div>

            {/* 4 Cards: Growth ($250M Investment) with Lottie Animations */}
            <h3 className="text-3xl font-bold text-white mb-8 pl-4 border-l-4 border-indigo-500">Crecimiento Exponencial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <LottieCard
                    lottieSrc="https://lottie.host/5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b/Investment.lottie"
                    title="$250M Inversión"
                    subtitle="Respaldados por fondos tier-1."
                    lottieSize="md"
                    className="bg-gradient-to-b from-indigo-900/20 to-transparent border-indigo-500/20"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c/GlobeNetwork.lottie"
                    title="+1M Usuarios"
                    subtitle="Comunidad global activa."
                    lottieSize="md"
                    className="bg-gradient-to-b from-indigo-900/20 to-transparent border-indigo-500/20"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d/Trophy.lottie"
                    title="Top 3 DeFi"
                    subtitle="Líderes en volumen on-chain."
                    lottieSize="md"
                    className="bg-gradient-to-b from-indigo-900/20 to-transparent border-indigo-500/20"
                />
                <LottieCard
                    lottieSrc="https://lottie.host/8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e/AwardMedal.lottie"
                    title="Premiados"
                    subtitle="Mejor Wallet Web3 2025."
                    lottieSize="md"
                    className="bg-gradient-to-b from-indigo-900/20 to-transparent border-indigo-500/20"
                />
            </div>

        </div>
    );
}
