"use client";

import { motion } from "framer-motion";

export default function Background() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#050505] overflow-hidden">
            {/* Deep Static Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#121216] to-black opacity-80" />

            {/* Organic Light Form 1 - Blue/Violet */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-indigo-900/20 rounded-full blur-[120px]"
            />

            {/* Organic Light Form 2 - Carbon/Cyan */}
            <motion.div
                animate={{
                    x: [0, -70, 70, 0],
                    y: [0, 70, -70, 0],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] bg-slate-800/20 rounded-full blur-[120px]"
            />
        </div>
    );
}
