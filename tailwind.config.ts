import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // o 'media'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            colors: {
                // Sistema Void
                void: "#000000",
                obsidian: "#050505",
                surface: "#0a0a0c",

                // Sistema Glass
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-surface": "rgba(255, 255, 255, 0.03)",
                "glass-highlight": "rgba(255, 255, 255, 0.06)",

                // Acentos Semánticos
                midgard: { // Indigo/Identidad
                    DEFAULT: "#6366f1", // Indigo 500
                    glow: "rgba(99, 102, 241, 0.5)",
                },
                asgard: { // Amber/Oro/Royalties
                    DEFAULT: "#f59e0b", // Amber 500
                    glow: "rgba(245, 158, 11, 0.5)",
                }
            },
            backgroundImage: {
                "void-gradient": "radial-gradient(circle at 50% 0%, #1a1b26 0%, #000000 80%)",
                "glass-gradient": "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "slide-up": "slideUp 0.5s ease-out forwards",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
