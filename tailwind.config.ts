import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
                serif: ["var(--font-merriweather)"],
            },
            colors: {
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-surface": "rgba(255, 255, 255, 0.03)",
                "deep-void": "#0a0a0c",
            },
            backgroundImage: {
                "crystalline-gradient": "radial-gradient(circle at 50% 0%, #1a1b26 0%, #050505 100%)",
            },
        },
    },
    plugins: [],
};
export default config;
