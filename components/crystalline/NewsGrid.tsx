'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG & DATA BASES ---
const CATEGORIES = [
    "Trending", "Breaking", "New", "Politics", "Sports", "Crypto",
    "Finance", "Geopolitics", "Earnings", "Tech", "Culture",
    "World", "Economy", "Climate", "Elections", "Mentions"
];

const TITLES_DB = [
    "Descentralización Absoluta: El fin de los intermediarios en",
    "Protocolo Activado: Nueva capa de seguridad para",
    "Identidad Soberana: Usuarios reclaman control sobre",
    "Liquidación Instantánea: Récord de volumen en nodos de",
    "Fallo en Dinero Fiat: Inversores mueven capital a",
    "Verificación Biométrica: El nuevo estándar en",
    "Consenso Global: Redes validadas aprueban cambios en",
    "Hashrate Histórico: La seguridad de la red supera a",
    "Smart Contracts: Automatización jurídica reemplaza a",
    "Tokenización de Activos Reales: El impacto en"
];

const INFO_TOPICS = [
    "Sovereign ID", "Zero-Knowledge Proofs", "DAO Governance", "Treasury V2",
    "Ledger Security", "Node Validators", "P2P Settlement", "Smart Wallets",
    "DeFi Bridge", "Layer 2 Scaling", "NFT Utility", "Biometric Hash",
    "Privacy Core", "Audit Logs", "Tokenomics", "Staking Pools",
    "Cross-Chain Ops", "API Gateways", "User Rights", "Immutable Storage"
];

// --- INTERFACES ---
interface NewsItem {
    id: string;
    category: string;
    date: string;
    title: string;
    image: string;
    content: string;
}

export const NewsGrid = () => {
    // STATE
    const [activeCategory, setActiveCategory] = useState("Trending");
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [weather, setWeather] = useState({ temp: "--", city: "Madrid" });
    const [currentTime, setCurrentTime] = useState("Initializing...");
    const [loading, setLoading] = useState(false);

    // Weather Init
    useEffect(() => {
        const savedCity = localStorage.getItem('humanid_city') || "Madrid";
        updateWeather(savedCity);
    }, []);

    // Time Widget
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toUTCString().replace('GMT', 'UTC // SYSTEM ACTIVE'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Feed Loader matches Category
    useEffect(() => {
        generateFeed(activeCategory);
    }, [activeCategory]);

    // --- LOGIC: WEATHER ---
    const updateWeather = async (city: string) => {
        try {
            // 1. Get Lat/Lon
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=es&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results) throw new Error("City not found");

            const { latitude, longitude, name } = geoData.results[0];

            // 2. Get Weather
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();

            setWeather({
                temp: `${weatherData.current_weather.temperature}`,
                city: name
            });
            localStorage.setItem('humanid_city', name);

        } catch (e) {
            console.log("Weather offline mode");
            setWeather({ temp: "22", city: city }); // Fallback
        }
    };

    // --- LOGIC: FEED ---
    const generateFeed = (category: string) => {
        setLoading(true);
        // Simulate network delay for "Realness"
        setTimeout(() => {
            const items: NewsItem[] = [];
            for (let i = 0; i < 50; i++) {
                const randTitle = TITLES_DB[Math.floor(Math.random() * TITLES_DB.length)];
                const imgId = 10 + i;
                // Picsum seed unique per item
                const imgUrl = `https://picsum.photos/seed/${category}${i}/600/400`;

                items.push({
                    id: `${category}-${i}-${Date.now()}`,
                    category: category,
                    date: new Date().toLocaleDateString(),
                    title: `${randTitle} ${category}`,
                    image: imgUrl,
                    content: `Análisis crítico del bloque ${Date.now().toString().slice(-6)}. La validación de los datos sugiere una ruptura con los modelos tradicionales. Este evento marca un hito en la adopción de infraestructuras no fiduciarias, asegurando la inmutabilidad de la información presentada.`
                });
            }
            setNewsItems(items);
            setLoading(false);
        }, 400);
    };


    return (
        <section className="font-sans text-white max-w-[1440px] mx-auto px-5">
            {/* --- SCOPED STYLES (Ported from Artifact) --- */}
            <style jsx>{`
                :global(:root) {
                    --bg-panel: rgba(20, 20, 30, 0.4);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --accent-cyan: #00f2ea;
                    --accent-purple: #7000ff;
                    --text-muted: #888899;
                    --success: #00ff9d;
                }
                
                .glass {
                    background: var(--bg-panel);
                    backdrop-filter: blur(16px);
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }

                /* NAVIGATION SCROLL HIDER */
                .intel-nav::-webkit-scrollbar { display: none; }
                .intel-nav { -ms-overflow-style: none; scrollbar-width: none; }

                /* WEATHER INPUT RESET */
                .weather-loc { background: transparent; border: none; color: #fff; width: 100px; outline: none; }
                .weather-loc:focus { border-bottom: 1px solid var(--accent-cyan); }
                
                /* CARD HOVER EFFECTS */
                .news-card-hover:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-cyan);
                }
                .news-card-hover:hover img { transform: scale(1.1); }
            `}</style>

            {/* --- MASTER HEADER --- */}
            <header className="flex flex-col md:flex-row justify-between items-center py-8 mb-10 border-b border-white/10 gap-6 relative">
                <div className="font-mono text-xs text-[#888899]">
                    {currentTime}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-auto md:relative md:left-auto md:transform-none order-first md:order-none cursor-pointer group">
                    <div className="glass px-8 py-3 rounded-xl relative border-white/10 group-hover:border-[#00f2ea] transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-[#00f2ea]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[#888899] font-sans tracking-tight relative z-10">
                            Humanid.fi
                        </h1>
                        <span className="block text-[0.6rem] text-[#00f2ea] tracking-[3px] font-mono text-center uppercase md:mt-[-5px]">
                            Decentralized Intel Core
                        </span>
                    </div>
                </div>

                <div className="glass flex items-center gap-4 px-5 py-2.5 rounded-full border-white/10 hover:border-[#00f2ea] transition-colors bg-black/30">
                    <div className="text-2xl">☁️</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[#00f2ea] text-lg leading-none">{weather.temp}°C</span>
                        <input
                            type="text"
                            className="weather-loc font-mono text-xs text-[#888899] cursor-text uppercase"
                            value={weather.city}
                            onChange={(e) => setWeather({ ...weather, city: e.target.value })}
                            onBlur={(e) => updateWeather(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updateWeather(e.currentTarget.value)}
                        />
                    </div>
                </div>
            </header>

            {/* --- NAVIGATION --- */}
            <nav className="intel-nav flex gap-3 overflow-x-auto pb-5 mb-5">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
                            px-6 py-3 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-300 border
                            ${activeCategory === cat
                                ? 'bg-[#00f2ea]/10 border-[#00f2ea] text-white shadow-[0_0_15px_rgba(0,242,234,0.1)]'
                                : 'bg-white/5 border-white/10 text-[#888899] hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {/* --- FEED CORE --- */}
            <div className="min-h-[600px] mt-5">
                {loading ? (
                    <div className="flex justify-center items-center h-64 font-mono text-[#00f2ea] animate-pulse">
                        [ DECRYPTING NODE STREAM... ]
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {newsItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.02 }}
                                    className="news-card-hover glass rounded-xl overflow-hidden relative group transition-all duration-400"
                                >
                                    <div className="h-[240px] w-full overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt="Intel"
                                            className="w-full h-full object-cover transition-transform duration-700"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between mb-4 text-xs font-mono text-[#00f2ea]">
                                            <span>{item.date}</span>
                                            <span>// {item.category.toUpperCase()} NODE {index + 1}</span>
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#bbbbbb]">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#a0a0b0] text-sm leading-relaxed text-justify">
                                            {item.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* --- SEPOLIA BOUNDARY --- */}
            <div className="mt-20 mb-16 pt-10 border-t border-dashed border-white/10 text-center relative">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black border border-[#7000ff] text-[#7000ff] px-5 py-1 text-xs font-mono uppercase tracking-[2px] shadow-[0_0_15px_rgba(112,0,255,0.3)]">
                    Sepolia Markets Boundary // User Generated Layer
                </span>
            </div>

            {/* --- IDENTITY & INFO LAYER (Bottom Grid) --- */}
            <div className="mb-24">

                {/* Docs Wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="glass p-10 rounded-xl relative overflow-hidden group hover:border-[#00f2ea] transition-colors">
                        <h3 className="text-3xl font-bold mb-2 relative z-10">Whitepaper v2.0</h3>
                        <p className="text-[#888899] relative z-10 max-w-[80%]">The technical manifesto for sovereign identity.</p>
                        <div className="absolute -right-5 -bottom-5 text-9xl opacity-5 grayscale group-hover:grayscale-0 transition-all">📄</div>
                    </div>
                    <div className="glass p-10 rounded-xl relative overflow-hidden group hover:border-[#7000ff] transition-colors border-[#7000ff]/30">
                        <h3 className="text-3xl font-bold mb-2 relative z-10 text-[#7000ff]">Announcements</h3>
                        <p className="text-[#888899] relative z-10 max-w-[80%]">Official protocol updates and governance votes.</p>
                        <div className="absolute -right-5 -bottom-5 text-9xl opacity-5 grayscale group-hover:grayscale-0 transition-all">📢</div>
                    </div>
                </div>

                <div className="mb-10 pl-5 border-l-4 border-[#00f2ea]">
                    <h4 className="text-lg uppercase tracking-widest font-semibold">Identity Financial Nodes</h4>
                    <p className="text-[#888899] text-sm mt-1">40 verified elements of the Humanid.fi ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Render 40 Nodes */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="glass p-5 rounded-lg border-white/5 hover:bg-[#00f2ea]/5 hover:border-[#00f2ea] transition-all cursor-pointer flex flex-col justify-between min-h-[120px]">
                            <span className="font-mono text-[0.65rem] text-[#888899] opacity-50">
                                BLOCK_REF: 0x{(i + 100).toString(16).toUpperCase()}
                            </span>
                            <div className="font-semibold text-sm mt-2 text-white">
                                {INFO_TOPICS[i % INFO_TOPICS.length]} // M{i + 1}
                            </div>
                            <div className="text-[0.65rem] text-[#00ff9d] mt-auto pt-2">
                                ● OPERATIONAL
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};
