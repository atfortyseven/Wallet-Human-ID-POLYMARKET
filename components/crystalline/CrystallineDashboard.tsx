import React from 'react';

export default function CrystallineDashboard() {
    return (
        <div className="w-full space-y-6">
            {/* Encabezado del Dashboard */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-black/90 p-8 backdrop-blur-xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                        Panel de Mercados
                    </h2>
                    <p className="text-gray-400 max-w-lg">
                        Bienvenido a tu interfaz de predicción descentralizada. Conecta tu identidad para comenzar a operar.
                    </p>
                </div>

                {/* Efecto decorativo de fondo */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
            </div>

            {/* Grid de Placeholders (mientras cargan los datos reales) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-40 rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-white/10 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                            <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
