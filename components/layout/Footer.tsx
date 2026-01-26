"use client";

import { Cpu, Github, Globe, Heart, ShieldCheck, Twitter } from "lucide-react";
import SystemStatus from "@/components/SystemStatus";

export function Footer() {
    return (
        <footer className="w-full mt-20 border-t border-white/5 bg-[#0D0D12]/80 backdrop-blur-xl z-10 relative">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
                            <Globe size={20} className="text-blue-500" />
                            <span>Polymarket News</span>
                        </div>
                        <p className="leading-relaxed opacity-80">
                            La terminal de inteligencia financiera descentralizada.
                            Noticias verificables, mercados predictivos y soberanía individual.
                        </p>
                    </div>

                    {/* Ecosystem */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold uppercase tracking-wider text-xs">Ecosistema</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Smart Contracts</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Whitepaper</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Auditorías</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold uppercase tracking-wider text-xs">Soporte</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Documentación</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Github Issues</a></li>
                        </ul>
                    </div>

                    {/* System Status */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold uppercase tracking-wider text-xs">Estado del Sistema</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                <span className="flex items-center gap-2 text-xs">
                                    <img src="https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" alt="Matic" className="w-4 h-4 opacity-80" />
                                    Polygon PoS
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                <span className="flex items-center gap-2 text-xs">
                                    <Cpu size={14} className="text-purple-400" />
                                    The Graph
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Synced
                                </span>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <SystemStatus />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs opacity-60">
                    <p>© 2024 Polymarket News. Open Source.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors"><Twitter size={16} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Github size={16} /></a>
                    </div>
                </div>
            </div>
        </footer >
    );
}
