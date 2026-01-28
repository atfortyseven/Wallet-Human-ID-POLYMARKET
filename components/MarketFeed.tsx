import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassBadge, ProgressBar } from './ui/GlassComponents';
import { TrendingUp, Clock, Users, ArrowRight } from 'lucide-react';

// 1. Datos Mock de "Alto Valor"
const MOCK_MARKETS = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    title: [
        "¿Aprobará la SEC el ETF de Ethereum este mes?",
        "¿Llegará Bitcoin a $100k antes de Q4?",
        "¿Ganará Real Madrid la Champions League?",
        "¿La inflación de EE.UU bajará del 2.5%?",
        "¿Superará GPT-5 el test de Turing?",
        "¿Elon Musk comprará otra red social?",
        "¿Base superará a Arbitrum en TVL?",
        "¿Lanzamiento de GTA VI antes de diciembre?",
        "¿Apple lanzará un anillo inteligente?",
        "¿Precio del Oro alcanzará máximo histórico?",
        "¿Elecciones en UK: Mayoría laborista?",
        "¿Solana mantendrá 100% uptime este mes?",
        "¿Se descubrirá vida en Marte (microbiana)?",
        "¿Netflix prohibirá compartir contraseñas globalmente?",
        "¿Mark Zuckerberg ganará la pelea contra Musk?"
    ][i],
    category: ["Cripto", "Economía", "Deportes", "Tech", "Política"][i % 5],
    volume: Math.floor(Math.random() * 500000) + 10000,
    probability: Math.floor(Math.random() * 80) + 10,
    endDate: "24h",
    participants: Math.floor(Math.random() * 1000)
}));

// Variantes para animacion en cascada (Stagger)
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const MarketFeed = () => {
    return (
        <div className="w-full max-w-7xl mx-auto mt-20">

            {/* Título de la Sección */}
            <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" />
                    Mercados en Tendencia
                </h3>
                <span className="text-blue-200/50 text-sm font-medium">15 Activos</span>
            </div>

            {/* Grid de Artículos */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
            >
                {MOCK_MARKETS.map((market) => (
                    <motion.div key={market.id} variants={item}>
                        <GlassCard className="h-full p-6 hover:bg-white/15 transition-colors cursor-pointer group">

                            {/* Header de la Tarjeta */}
                            <div className="flex justify-between items-start mb-4">
                                <GlassBadge color={market.category === 'Cripto' ? 'purple' : 'blue' as any}>
                                    {market.category}
                                </GlassBadge>
                                <div className="flex items-center gap-1 text-xs text-blue-200/60 bg-black/20 px-2 py-1 rounded-full">
                                    <Clock size={12} />
                                    <span>{market.endDate} left</span>
                                </div>
                            </div>

                            {/* Título Principal */}
                            <h4 className="text-lg font-bold text-white leading-snug mb-4 group-hover:text-cyan-300 transition-colors">
                                {market.title}
                            </h4>

                            {/* Data Visualization (Odds) */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-300 font-medium">SÍ {market.probability}%</span>
                                    <span className="text-red-300 font-medium">NO {100 - market.probability}%</span>
                                </div>
                                <ProgressBar value={market.probability} />
                            </div>

                            {/* Footer / Stats */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-xs text-blue-100/60">
                                    <Users size={14} />
                                    <span>{market.participants} Traders</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-mono text-cyan-200">
                                    ${(market.volume / 1000).toFixed(1)}k Vol
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                                </div>
                            </div>

                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
