'use client';

import { motion } from 'framer-motion';

/**
 * MetaMask-inspired interface component
 * Glassmorphism design with scroll-based opacity
 */
export function MetaMaskInterface() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="glass-pearl rounded-3xl p-12 border border-white/[0.05] text-center">
        {/* Header */}
        <motion.h1
          className="text-5xl sm:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to <span className="text-cyan-400">HumanID.fi</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your sovereign digital identity, protected by zero-knowledge proofs.
          No seed phrases, just biometric verification.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Connect Identity
        </motion.button>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4 mt-8 flex-wrap"
        >
          {['Biometric Auth', 'ZK-Proofs', 'Self-Sovereign'].map((feature, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-white/[0.03] border border-white/[0.1] rounded-full text-sm text-zinc-300"
            >
              {feature}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
