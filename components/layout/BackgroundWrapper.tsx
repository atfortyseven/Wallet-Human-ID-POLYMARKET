"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function BackgroundWrapper() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="fixed inset-0 bg-neutral-900 z-[-1]" />
    );

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] pointer-events-none">
            {/* Video Layer */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/background2.mp4" type="video/mp4" />
            </video>

            {/* Theme Overlay Layer */}
            {/* Dark Mode: Slight dark tint to ensure text readability on top of video */}
            <div
                className={`absolute inset-0 transition-all duration-700 ease-in-out
          ${theme === 'dark'
                        ? 'bg-black/60 backdrop-blur-[2px]'
                        : 'bg-white/95 backdrop-blur-xl'
                    }
        `}
            />

            {/* Noise Texture (Optional Premium Feel) */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
