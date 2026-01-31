"use client";

import React from 'react';
import { ArrowRight, Mail, BookOpen } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';

export function Web3AccessSection() {
    const { open } = useAppKit();

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-32 flex flex-col items-center">
            
            {/* Cartoon / Access Area */}
            <div className="relative mb-32 text-center group">
                {/* Visual Glow */}
                <div className="w-64 h-64 mx-auto bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow pointer-events-none" />
                
                {/* Image Container Removed as per request */}

                
                <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-xl">
                    Acceda a la web3
                </h2>
                
                <button 
                    onClick={() => open()}
                    className="
                        px-12 py-5 bg-white text-black text-xl font-bold rounded-full 
                        hover:bg-gray-100 transition-all active:scale-95 
                        flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(255,255,255,0.3)]
                    "
                >
                    Comenzar <ArrowRight size={24} />
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
                    <SubscribeForm />
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

function SubscribeForm() {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [subscribed, setSubscribed] = React.useState(false);
    
    // Import toast dynamically or pass as prop if cleaner, but local import is fine
    const { toast } = require('sonner'); 

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) return toast.error("Please enter a valid email");
        
        setLoading(true);
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message || "Subscribed successfully!");
                setSubscribed(true);
                setEmail('');
            } else {
                toast.error(data.error || "Failed to subscribe");
            }
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (subscribed) {
        return (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-bold text-center">
                ✅ Subscribed! Check your email.
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white w-full focus:border-blue-500 outline-none transition-colors"
            />
            <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
                {loading ? '...' : 'Subscribe'}
            </button>
        </div>
    );
}
