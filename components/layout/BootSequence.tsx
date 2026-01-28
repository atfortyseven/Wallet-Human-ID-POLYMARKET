'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ZK LORE: Textos reales de criptografía ---
const ZK_LOGS = [
    "SYSTEM_INITIATED_BN254...",
    "GENERATING_WITNESS_PARAMETERS...",
    "COMPUTING_MERKLE_ROOT_HASH...",
    "NON_INTERACTIVE_CHALLENGE_ACCEPTED...",
    "CONSTRUCTING_ZK_SNARK_PROOF...",
    "OBSFUCATING_PUBLIC_INPUTS...",
    "VERIFYING_ON_CHAIN_ANCHOR...",
    "ESTABLISHING_SECURE_TUNNEL_V3...",
    "IDENTITY_LAYER_UNLOCKED::SOVEREIGN_MODE"
];

// Generador de hashes aleatorios para efecto visual "Matrix"
const generateRandomHash = () =>
    '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const BootSequence = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLog, setCurrentLog] = useState("INITIALIZING...");
    const [hashStream, setHashStream] = useState(generateRandomHash());
    const [isHovered, setIsHovered] = useState(false); // Interactividad

    useEffect(() => {
        // 1. Force Show (Session check removed for debugging)
        // const hasBooted = sessionStorage.getItem('zk_boot_v2_force_show_4aa1');
        // if (hasBooted) {
        //    setIsVisible(false);
        //    return;
        // }

        // 2. Secuencia de Carga
        const duration = 3500; // 3.5 segundos de viaje
        const intervalTime = 50;
        const totalSteps = duration / intervalTime;
        let step = 0;

        const timer = setInterval(() => {
            step++;

            // Curva de aceleración (Empieza lento, acaba rapidísimo)
            const easeInOut = step < totalSteps / 2
                ? 2 * step * step / (totalSteps * totalSteps)
                : 1 - Math.pow(-2 * step + 2, 2) / 2;

            const currentPercent = Math.min(100, Math.floor(easeInOut * 100));
            setProgress(currentPercent);

            // Cambiar logs según el progreso
            const logIndex = Math.floor((currentPercent / 100) * (ZK_LOGS.length - 1));
            setCurrentLog(ZK_LOGS[logIndex]);

            // Efecto de Hash loco cambiando
            setHashStream(generateRandomHash());

            if (step >= totalSteps) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsVisible(false);
                    sessionStorage.setItem('zk_boot_v2_force_show_4aa1', 'true');
                }, 800);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.5, // Efecto de entrar en el hiperespacio al terminar
                        filter: "blur(40px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden font-mono"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* 1. FONDO DE VIDEO (Warp Speed) - Placeholder removed for stability, using gradient for now */}
                    <div className="absolute inset-0 z-0 opacity-60">
                        {/* Video removed temporarily to avoid 404s, replaced with deep space gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050510]/90 to-black/90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />

                        {/* Subtle Animated Stars */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    </div>

                    {/* 2. INTERFAZ CENTRAL (Glassmorphism) */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 w-full max-w-lg p-8 mx-4"
                    >
                        {/* Título y Estado */}
                        <div className="flex flex-col items-center mb-12 space-y-4 text-center">
                            <motion.h1
                                className="text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                animate={{ textShadow: ["0 0 10px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0.6)", "0 0 10px rgba(255,255,255,0.2)"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                HUMAN<span className="text-[#00f2ea]">ID</span>
                            </motion.h1>

                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-[#00f2ea] animate-pulse" />
                                <span className="text-[10px] tracking-[0.2em] text-[#00f2ea] uppercase">
                                    Zero-Knowledge Environment
                                </span>
                            </div>
                        </div>

                        {/* Barra de Progreso Minimalista */}
                        <div className="relative w-full h-[2px] bg-gray-800 rounded-full overflow-hidden mb-6">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_white]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Datos Técnicos (Logs & Hash) */}
                        <div className="flex flex-col items-center space-y-2">
                            {/* Porcentaje Gigante */}
                            <div className="text-4xl font-light text-white tabular-nums">
                                {progress}<span className="text-lg opacity-40">%</span>
                            </div>

                            {/* Log Actual */}
                            <motion.p
                                key={currentLog} // Re-animar cuando cambia
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-gray-400 tracking-widest uppercase"
                            >
                                {currentLog}
                            </motion.p>

                            {/* Hash Scramble Decorativo */}
                            <p className="text-[10px] font-mono text-gray-600 truncate max-w-[300px] opacity-50">
                                {hashStream}
                            </p>
                        </div>
                    </motion.div>

                    {/* Footer Legal/Técnico */}
                    <div className="absolute bottom-8 text-[10px] text-gray-500 font-mono text-center w-full opacity-60">
                        <p>POWERED BY BASE SEPOLIA // ZK-STARK PROTOCOL</p>
                        <p className="mt-1 text-[8px]">SECURE ENCLAVE ACTIVE</p>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
