"use client";

import React from 'react';

export function HumanDefiFooter() {
    const sections = [
        {
            title: "Human Defi",
            links: ["Obtener Wallet", "Comprar", "Ganar", "Canjear", "Recompensas"]
        },
        {
            title: "NUEVA",
            links: ["Predecir", "Perps", "Escudo de Transacciones", "Snaps"]
        },
        {
            title: "Productos",
            links: ["Tarjeta Human", "Human USD", "Smart Accounts Kit", "Billeteras integradas"]
        },
        {
            title: "Aprender",
            links: ["Desarrolladores", "Ver los documentos", "Panel de control", "SDK", "Servicios Web3"]
        },
        {
            title: "Acerca de",
            links: ["Seguridad", "Soporte", "Blog", "Carreras", "Contacto"]
        }
    ];

    return (
        <footer className="w-full bg-black border-t border-white/10 py-20 px-4 mt-20 relative z-10 text-center md:text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                {sections.map((section, i) => (
                    <div key={i}>
                        <h4 className="text-white font-bold mb-6">{section.title}</h4>
                        <ul className="space-y-4">
                            {section.links.map((link, j) => (
                                <li key={j}>
                                    <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs">
                <p>&copy; 2026 Human Defi. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                </div>
            </div>
        </footer>
    );
}
