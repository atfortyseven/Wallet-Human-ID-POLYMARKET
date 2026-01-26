"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

// --- VOID CARD ---
interface VoidCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "glass" | "solid";
}

export function VoidCard({ children, className, variant = "glass", ...props }: VoidCardProps) {
    const baseStyles = "rounded-3xl p-6 relative overflow-hidden transition-all duration-300";
    const variants = {
        glass: "bg-surface/40 backdrop-blur-xl border border-glass-border hover:border-white/10",
        solid: "bg-surface border border-neutral-900"
    };

    return (
        <motion.div
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// --- VOID BUTTON ---
interface VoidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    glow?: boolean;
}

export function VoidButton({
    children,
    className,
    variant = "primary",
    size = "md",
    glow = false,
    ...props
}: VoidButtonProps) {
    const baseStyles = "rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden";

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base font-bold"
    };

    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200",
        secondary: "bg-surface border border-glass-border text-white hover:bg-white/5",
        danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
        ghost: "bg-transparent text-neutral-400 hover:text-white"
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                sizes[size],
                variants[variant],
                glow && variant === 'primary' && "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

// --- VOID INPUT ---
interface VoidInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function VoidInput({ label, className, ...props }: VoidInputProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all font-mono",
                    className
                )}
                {...props}
            />
        </div>
    );
}
