"use client";

import React from 'react';
import { ArrowRight, Mail, BookOpen } from 'lucide-react';

export function Web3AccessSection() {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center">
            
            {/* Cartoon / Access Area */}
            <div className="relative mb-24 text-center">
                {/* Visual Placeholder for Cartoon */}
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-sm opacity-20 animate-pulse absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="relative z-10 w-40 h-40 mx-auto bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white/10 mb-6">
                    <span className="text-4xl">🦊</span> {/* Placeholder emoji for lack of asset */}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Acceda a la web3</h2>
                
                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto">
                    Comenzar <ArrowRight size={18} />
                </button>
            </div>

            {/* Updates & News Cards (2 Large Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Subscription */}
                <div className="bg-zinc-900/80 border border-white/10 p-8 rounded-3xl">
                    <Mail size={32} className="text-white mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Recibe actualizaciones</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        Human Defi puede utilizar la información de contacto que nos proporciones para contactarte acerca de nuestros productos y servicios. Al hacer clic en “suscribirse”, aceptas recibir dichas comunicaciones.
                    </p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email" className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white w-full" />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Suscribirse</button>
                    </div>
                </div>

                {/* News / Learn */}
                <div className="bg-zinc-900/80 border border-white/10 p-8 rounded-3xl">
                    <BookOpen size={32} className="text-white mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Novedades DeFi & Web3</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        A través de una serie de lecciones interactivas, Human Defi Learn te enseñará qué es la web3, por qué es importante para ti y cómo usar tu wallet en el proceso.
                    </p>
                    <button className="text-blue-400 font-bold hover:underline">Explorar Novedades &rarr;</button>
                </div>
            </div>

        </div>
    );
}
