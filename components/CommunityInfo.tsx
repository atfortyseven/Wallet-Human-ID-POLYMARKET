'use client';

import React from 'react';
import LottieCard from './ui/LottieCard';
import { Users, TrendingUp, Globe, Award, Shield, Zap, Heart, MessageCircle, DollarSign, BookOpen, Target, Trophy, Sparkles, Lock, Wallet, Coins, BarChart, Star, CheckCircle, Gift } from 'lucide-react';

export function CommunityInfo() {
    const communityCards = [
        {
            lottieSrc: "https://lottie.host/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/Community.lottie",
            title: "+150K Miembros",
            subtitle: "Comunidad global activa en 45 países",
            icon: Users
        },
        {
            lottieSrc: "https://lottie.host/b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e/Growth.lottie",
            title: "300% Crecimiento",
            subtitle: "Aumento mensual de usuarios verificados",
            icon: TrendingUp
        },
        {
            lottieSrc: "https://lottie.host/c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f/Global.lottie",
            title: "Alcance Global",
            subtitle: "Operaciones en 45+ países del mundo",
            icon: Globe
        },
        {
            lottieSrc: "https://lottie.host/d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a/Prize.lottie",
            title: "$2M en Premios",
            subtitle: "Distribuidos a la comunidad este año",
            icon: Award
        },
        {
            lottieSrc: "https://lottie.host/e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b/Security.lottie",
            title: "100% Seguro",
            subtitle: "Auditorías de seguridad trimestrales",
            icon: Shield
        },
        {
            lottieSrc: "https://lottie.host/f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c/Speed.lottie",
            title: "<1s Transacciones",
            subtitle: "Velocidad promedio en Layer 2",
            icon: Zap
        },
        {
            lottieSrc: "https://lottie.host/a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d/Heart.lottie",
            title: "98% Satisfacción",
            subtitle: "Rating promedio de usuarios activos",
            icon: Heart
        },
        {
            lottieSrc: "https://lottie.host/b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e/Chat.lottie",
            title: "24/7 Soporte",
            subtitle: "Equipo disponible en Discord y Telegram",
            icon: MessageCircle
        },
        {
            lottieSrc: "https://lottie.host/c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f/Money.lottie",
            title: "$50M Volumen",
            subtitle: "Volumen total de trading acumulado",
            icon: DollarSign
        },
        {
            lottieSrc: "https://lottie.host/d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a/Learn.lottie",
            title: "200+ Tutoriales",
            subtitle: "Academia DeFi gratuita para todos",
            icon: BookOpen
        },
        {
            lottieSrc: "https://lottie.host/e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b/Target.lottie",
            title: "92% Precisión",
            subtitle: "Predicciones acertadas en mercados",
            icon: Target
        },
        {
            lottieSrc: "https://lottie.host/f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c/Trophy.lottie",
            title: "Top 5 DeFi",
            subtitle: "Ranking global en plataformas DeFi",
            icon: Trophy
        },
        {
            lottieSrc: "https://lottie.host/a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d/Magic.lottie",
            title: "Zero Gas Fees",
            subtitle: "Transacciones gratuitas para holders",
            icon: Sparkles
        },
        {
            lottieSrc: "https://lottie.host/b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e/Lock.lottie",
            title: "Non-Custodial",
            subtitle: "Tú controlas tus claves privadas siempre",
            icon: Lock
        },
        {
            lottieSrc: "https://lottie.host/c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f/Wallet.lottie",
            title: "Multi-Chain",
            subtitle: "Compatible con 15+ blockchains",
            icon: Wallet
        },
        {
            lottieSrc: "https://lottie.host/d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a/Coins.lottie",
            title: "12% APY Promedio",
            subtitle: "Rendimientos en staking automático",
            icon: Coins
        },
        {
            lottieSrc: "https://lottie.host/e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b/Chart.lottie",
            title: "500K Operaciones",
            subtitle: "Transacciones procesadas este mes",
            icon: BarChart
        },
        {
            lottieSrc: "https://lottie.host/f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c/Star.lottie",
            title: "4.9/5 Rating",
            subtitle: "Calificación en todas las plataformas",
            icon: Star
        },
        {
            lottieSrc: "https://lottie.host/a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d/Check.lottie",
            title: "99.9% Uptime",
            subtitle: "Disponibilidad garantizada anual",
            icon: CheckCircle
        },
        {
            lottieSrc: "https://lottie.host/b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e/Gift.lottie",
            title: "Referral Program",
            subtitle: "Gana 15% de comisión por referido",
            icon: Gift
        }
    ];

    return (
        <div className="w-full max-w-[1440px] mx-auto mb-12 px-5">
            {/* Header */}
            <div className="mb-8 px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                    Nuestra Comunidad
                </h2>
                <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                    Cifras reales de una comunidad que está cambiando el futuro de DeFi
                </p>
            </div>

            {/* Grid de 20 Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                {communityCards.map((card, index) => (
                    <LottieCard
                        key={index}
                        lottieSrc={card.lottieSrc}
                        title={card.title}
                        subtitle={card.subtitle}
                        lottieSize="md"
                        className="hover:scale-105 transition-transform duration-300"
                    />
                ))}
            </div>
        </div>
    );
}
