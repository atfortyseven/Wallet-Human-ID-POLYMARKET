'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LockOpen, Blocks, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-colors hover:border-cyan-500/30"
        >
            {/* Glossy Overlay Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/[0.03] border border-white/[0.1] text-zinc-300 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                <Icon size={24} strokeWidth={1.5} />
            </div>

            <h3 className="mb-3 text-xl font-bold text-white tracking-tight group-hover:text-cyan-100 transition-colors">
                {title}
            </h3>

            <p className="text-zinc-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
}

export function FeaturesSection() {
    return (
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4"
                    >
                        Arquitectura de Confianza
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-400 max-w-2xl mx-auto text-lg"
                    >
                        Redefiniendo la identidad digital con los estándares más altos de privacidad y soberanía.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Privacidad Biométrica (ZK-Snarks)"
                        description="Verifica tu humanidad sin revelar nunca tus datos biométricos reales. Tu rostro genera una prueba matemática de cero conocimiento; tus datos nunca salen de tu dispositivo."
                        delay={0}
                    />
                    <FeatureCard
                        icon={LockOpen}
                        title="Soberanía Digital Total"
                        description="Tus credenciales de identidad viven en tu wallet, no en nuestros servidores. Eres el único dueño de tu HumanID; tú decides qué compartes, con quién y cuándo."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Blocks}
                        title="Pasaporte Web3 Universal"
                        description="Un solo inicio de sesión para todo el ecosistema. Accede a Polymarket, Aave, DAOs y metaversos sin gestionar múltiples cuentas ni contraseñas."
                        delay={0.2}
                    />
                </div>
            </div>
        </section>
    );
}
