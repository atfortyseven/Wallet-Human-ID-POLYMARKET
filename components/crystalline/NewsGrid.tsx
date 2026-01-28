'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURACIÓN Y BASES DE DATOS SIMULADAS ---
const CATEGORIES = [
    "Trending", "Breaking", "New", "Politics", "Sports", "Crypto",
    "Finance", "Geopolitics", "Earnings", "Tech", "Culture",
    "World", "Economy", "Climate & Science", "Elections", "Mentions"
];

const CONTENT_BASES = {
    titles: [
        "Impacto global tras el anuncio oficial de", "Nuevas regulaciones afectan directamente a",
        "El mercado reacciona con volatilidad ante", "Descubrimiento clave cambia el panorama de",
        "Análisis exclusivo: Lo que nadie vio sobre", "Crisis inminente en el sector de",
        "Récord histórico alcanzado hoy en", "Fusión estratégica entre gigantes de",
        "La inteligencia artificial transforma", "Protestas masivas tras la aprobación de"
    ],
    bodies: [
        "En un desarrollo sorprendente que ha sacudido los cimientos del sector, los analistas confirman que las tendencias actuales apuntan a un cambio de paradigma irreversible. Las fuentes oficiales han verificado los datos, mostrando una correlación directa entre los eventos de la última semana y la respuesta del mercado global.",
        "Expertos de alto nivel sugieren cautela. La volatilidad observada en las últimas 24 horas no tiene precedentes, y se espera que las próximas declaraciones oficiales definan el curso de acción para el resto del trimestre fiscal. La implementación de nuevas tecnologías ha sido el catalizador principal.",
        "El informe detallado publicado esta mañana revela discrepancias significativas con las previsiones anteriores. Esto obliga a una reestructuración inmediata de las estrategias a largo plazo. La comunidad internacional observa con atención, dado que las implicaciones geopolíticas son vastas y complejas.",
        "Con la confirmación verificada de múltiples agencias, estamos ante uno de los hitos más importantes de la década. La integración de sistemas descentralizados está permitiendo una eficiencia nunca antes vista, aunque los riesgos de seguridad siguen siendo un tema de debate caliente en las mesas directivas."
    ]
};

// --- UTILIDADES ---
const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('es-ES', options);
};

interface NewsItem {
    id: string;
    category: string;
    date: string;
    title: string;
    image: string;
    content: string;
}

export const NewsGrid = ({ category: initialCategory = "Trending" }: { category?: string }) => {
    const [currentCategory, setCurrentCategory] = useState(initialCategory);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Set para evitar duplicados en la sesión actual
    const processedNewsIds = useRef(new Set<string>());

    // --- MOTOR DE GENERACIÓN (MOCK ENGINE) ---
    const generateUniqueNewsItem = (cat: string, index: number): NewsItem => {
        const seed = Math.random();
        const titleBase = CONTENT_BASES.titles[Math.floor(seed * CONTENT_BASES.titles.length)];
        const bodyBase = CONTENT_BASES.bodies[Math.floor(Math.random() * CONTENT_BASES.bodies.length)];
        const specificTopic = `${cat} Protocol ${index + 204}`;

        // Mapeo simula keywords para imágenes
        const catMap: Record<string, string> = {
            'Trending': 'news', 'Breaking': 'emergency', 'New': 'fresh', 'Politics': 'government',
            'Sports': 'stadium', 'Crypto': 'bitcoin', 'Finance': 'chart', 'Geopolitics': 'map',
            'Earnings': 'money', 'Tech': 'robot', 'Culture': 'art', 'World': 'earth',
            'Economy': 'bank', 'Climate & Science': 'laboratory', 'Elections': 'vote', 'Mentions': 'social'
        };
        const keyword = catMap[cat] || 'news';

        // Picsum con semilla única por ID para consistencia visual (anti-flicker)
        const uniqueId = `news-${cat}-${index}`;
        const randomImg = `https://picsum.photos/seed/${uniqueId}/600/400`;

        return {
            id: uniqueId,
            category: cat.toUpperCase(),
            date: getTodayDate(),
            title: `${titleBase} ${specificTopic}`,
            image: randomImg,
            content: `${bodyBase} Este evento marca un punto de inflexión para ${cat}, donde la lógica del mercado y la intervención humana convergen.`
        };
    };

    const loadFeed = (cat: string) => {
        setLoading(true);
        // Simulación de delay de red
        setTimeout(() => {
            const newItems: NewsItem[] = [];
            processedNewsIds.current.clear(); // Reset simple por vista

            for (let i = 0; i < 50; i++) { // 50 Items solicitados
                const item = generateUniqueNewsItem(cat, i);
                if (processedNewsIds.current.has(item.id)) continue;

                processedNewsIds.current.add(item.id);
                newItems.push(item);
            }

            setNewsItems(newItems);
            setLoading(false);
        }, 600);
    };

    // Efecto inicial y cambio de categoría
    useEffect(() => {
        loadFeed(currentCategory);
    }, [currentCategory]);

    return (
        <section id="global-intel-wrapper" className="max-w-[1400px] mx-auto p-5 font-sans">
            {/* --- ESTILOS INYECTADOS (CSS Scopeado para este componente) --- */}
            <style jsx>{`
                :global(:root) {
                    --glass-bg: rgba(20, 20, 30, 0.6);
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --glass-shine: rgba(255, 255, 255, 0.05);
                    --accent-color: #00f2ea;
                }
                .intel-nav::-webkit-scrollbar { display: none; }
                .intel-nav { -ms-overflow-style: none; scrollbar-width: none; }
                
                .glass-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    border-color: rgba(255,255,255,0.25);
                }
                .card-image { transition: transform 0.5s ease; }
                .glass-card-hover:hover .card-image { transform: scale(1.05); }
            `}</style>

            {/* --- HEADER --- */}
            <div className="mb-6 border-b border-white/10 pb-4">
                {/* Título manejado en page.tsx, pero mantenemos estructura interna si es necesario */}
            </div>

            {/* --- NAVIGATION MENU --- */}
            <nav className="intel-nav flex gap-4 overflow-x-auto pb-5 mb-5">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCurrentCategory(cat)}
                        className={`
                            px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 backdrop-blur-md border
                            ${currentCategory === cat
                                ? 'bg-[#00f2ea]/15 border-[#00f2ea] text-[#00f2ea] shadow-[0_0_15px_rgba(0,242,234,0.2)]'
                                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {/* --- FEED GRID --- */}
            <div className="min-h-[500px]">
                {loading ? (
                    <div className="col-span-2 text-center py-20 text-[#00f2ea] animate-pulse font-mono text-lg">
                        Analizando datos globales en tiempo real...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {newsItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="glass-card-hover bg-[#14141e]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative flex flex-col overflow-hidden group"
                                >
                                    <div className="w-full h-[220px] rounded-lg overflow-hidden mb-5 relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="card-image w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-neutral-400 mb-4 uppercase tracking-widest font-mono">
                                        <span>{item.date}</span>
                                        <span className="text-[#00f2ea] font-bold">#{item.category}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-neutral-300 text-sm leading-relaxed text-justify">
                                            {item.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* --- SEPOLIA MARKETS BOUNDARY --- */}
            <div className="mt-16 pt-10 border-t-2 border-dashed border-white/10 text-center relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-5 text-[#00f2ea] text-xs font-bold tracking-[0.2em] uppercase">
                    Mercados en Base Sepolia
                </span>
                <p className="text-neutral-500 text-xs mt-2 font-mono">
                    Below starts the User Generated Markets Layer
                </p>
            </div>
        </section>
    );
};
