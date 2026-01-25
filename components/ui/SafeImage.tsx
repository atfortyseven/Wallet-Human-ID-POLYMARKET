"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
    src?: string;
    fallbackCategory?: string;
    className?: string;
}

export default function SafeImage({
    src,
    alt,
    fallbackCategory = "News",
    className,
    ...props
}: SafeImageProps) {
    const [error, setError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reiniciar estado si cambia el src
    useEffect(() => {
        setError(false);
    }, [src]);

    if (!mounted) return null; // Evitar hidratación mismatch simple

    // Lógica de Fallback
    if (!src || error) {
        return (
            <div className={cn(
                "flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800",
                className
            )}>
                <span className="text-white/10 font-serif font-bold italic text-3xl tracking-widest uppercase select-none">
                    {fallbackCategory}
                </span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
