"use client";

import React from 'react';
import { InteractiveCard } from './InteractiveCard';
import { CreditCard, Shield, Coins, TrendingUp, Zap } from 'lucide-react';

export function FeatureCardsSection() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-20">
            {/* 1. Buy & Redeem */}
            <InteractiveCard 
                title="Compra y canjea" 
                subtitle="Soporte nativo para USD y ETH"
                image={<CreditCard size={64} className="text-blue-400" />}
                color="from-blue-500 to-indigo-500"
            >
                <div className="flex gap-4 justify-center mt-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs">USD</div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs">ETH</div>
                </div>
            </InteractiveCard>

            {/* 2. Secure Accounts (Spans 2 cols on large) */}
            <div className="lg:col-span-2">
                <InteractiveCard 
                    title="Human Defi" 
                    subtitle="Rompiendo límites 2027"
                    image={<Shield size={64} className="text-green-400" />}
                    color="from-green-500 to-emerald-500"
                >
                    <div className="mt-2 text-center">
                        <div className="text-3xl font-bold text-white">$124,592.21</div>
                        <div className="text-green-300 text-sm flex items-center justify-center gap-1">
                             <TrendingUp size={14} /> Portfolio Seguro On-Chain
                        </div>
                    </div>
                </InteractiveCard>
            </div>

            {/* 3. Rewards */}
            <InteractiveCard 
                title="Recompensas" 
                subtitle="Gana royalties automáticamente"
                image={<Coins size={64} className="text-yellow-400" />}
                color="from-yellow-500 to-amber-500"
            >
               <div className="mt-4 text-center text-xs text-white/50">
                   Stake y gana pasivamente con Human ID
               </div>
            </InteractiveCard>

            {/* 4. Earn with Crypto */}
            <InteractiveCard 
                title="Haz crecer tu cripto" 
                subtitle="Yield farming simplificado"
                image={<TrendingUp size={64} className="text-purple-400" />}
                color="from-purple-500 to-pink-500"
            />

             {/* 5. Speed/Bonus */}
             <InteractiveCard 
                title="Ultra Rápido" 
                subtitle="Ejecución instantánea en L2"
                image={<Zap size={64} className="text-orange-400" />}
                color="from-orange-500 to-red-500"
            />
        </div>
    );
}
