"use client";

import { useState } from "react";
import { X, Vote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProposeMarket } from "@/components/governance/ProposeMarket";
import { useAuth } from "@/hooks/useAuth";

interface GovernanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GovernanceModal({ isOpen, onClose }: GovernanceModalProps) {
    const { isAuthenticated } = useAuth();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="relative rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[var(--border-main)] px-6 py-4 bg-[var(--bg-surface)]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-indigo-500/10">
                                        <Vote className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                            Crear Encuesta
                                        </h2>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Propón una pregunta a la comunidad
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {!isAuthenticated ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="p-4 rounded-full bg-red-500/10 mb-4">
                                            <Vote className="w-12 h-12 text-red-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                            Verificación Requerida
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] max-w-md">
                                            Solo los usuarios verificados con World ID pueden crear encuestas.
                                            Por favor, verifica tu identidad primero.
                                        </p>
                                    </div>
                                ) : (
                                    <ProposeMarket onClose={onClose} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
