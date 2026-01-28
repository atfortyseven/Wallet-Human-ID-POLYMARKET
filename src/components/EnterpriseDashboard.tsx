import React from 'react';

export default function EnterpriseDashboard({ initialData }: { initialData?: any }) {
    // Use initialData for treasury/intel if provided
    const treasury = initialData?.treasury || { tvl: 8492000, supply: "15.2M", revenue: 420100 };
    const intel = initialData?.intel || [];

    return (
        <div className="min-h-screen bg-[#080808] text-[#EAEAEA] font-sans selection:bg-white/20">

            {/* 1. MESH BACKGROUND (Sutil, como Polygon/Worldcoin) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[0%] w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full opacity-30 mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto p-8 lg:p-12">

                {/* HEADER REMOVED AS REQUESTED */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/5 pb-8" style={{ display: 'none' }}>
                    <div>
                        <h2 className="text-xs font-mono text-neutral-500 mb-2 tracking-widest uppercase">Protocol Overview</h2>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
                            Financial Integrity <span className="text-neutral-600">Ledger</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <DataBadge label="Network" value="Base Mainnet" status="live" />
                        <DataBadge label="Status" value="Operational" status="success" />
                    </div>
                </header>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* BLOQUE 1: TREASURY (Oculto) */}
                    <div className="md:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group hidden">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-neutral-500 text-sm font-medium mb-1">Total Treasury Value</p>
                                <h3 className="text-4xl font-semibold text-white tracking-tight">
                                    ${typeof treasury.tvl === 'number' ? treasury.tvl.toLocaleString(undefined, { minimumFractionDigits: 2 }) : treasury.tvl}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                                ↗
                            </div>
                        </div>

                        {/* Mini Gráfico CSS Puro (Elegante) */}
                        <div className="flex items-end gap-1 h-16 mb-4 opacity-50">
                            {[40, 65, 50, 80, 55, 90, 70, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/20 hover:bg-white/40 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                            <span className="text-emerald-400">+12.5%</span> vs last epoch
                        </div>
                    </div>

                    {/* BLOQUE 2: SUPPLY METRICS */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-neutral-500 text-sm font-medium mb-4">Circulating Supply</p>
                            <div className="text-3xl font-medium text-white mb-1">
                                {typeof treasury.supply === 'number' ? (treasury.supply / 1000000).toFixed(1) + 'M' : treasury.supply} <span className="text-lg text-neutral-600">HMND</span>
                            </div>
                            <div className="w-full bg-neutral-800 h-1 rounded-full mt-4 overflow-hidden">
                                <div className="bg-white h-full w-[15%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-neutral-500 font-mono uppercase">
                                <span>Unlocked (15%)</span>
                                <span>Cap 100M</span>
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE 3: GOVERNANCE POWER */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-neutral-500 text-sm font-medium mb-4">Governance Weight</p>
                            <div className="text-3xl font-medium text-white mb-1">0.00 <span className="text-lg text-neutral-600">vHMND</span></div>
                        </div>
                        <button className="w-full py-3 mt-4 border border-white/10 rounded-lg text-sm font-medium text-neutral-300 hover:bg-white/5 transition-colors">
                            Delegate Votes
                        </button>
                    </div>

                    {/* BLOQUE 4: RECENT INTEL (Listado estilo tabla) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-[#111] border border-white/5 rounded-2xl p-8 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-white">Verified Intelligence Stream</h3>
                            <button className="text-xs text-neutral-400 hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="space-y-0">
                            {intel.length > 0 ? intel.map((item: any, i: number) => (
                                <ListItem
                                    key={i}
                                    category={item.category}
                                    title={item.title}
                                    time={new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    source={item.source}
                                />
                            )) : (
                                <>
                                    <ListItem
                                        category="Geopolitics"
                                        title="EU Parliament ratifies new AI Framework Regulation"
                                        time="12m ago"
                                        source="Reuters"
                                    />
                                    <ListItem
                                        category="Finance"
                                        title="BlackRock files for new Ethereum Spot ETF"
                                        time="45m ago"
                                        source="Bloomberg"
                                    />
                                    <ListItem
                                        category="Tech"
                                        title="OpenAI announces GPT-5 release window"
                                        time="1h ago"
                                        source="TechCrunch"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* BLOQUE 5: YOUR IDENTITY (Minimalista) */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />
                        <p className="text-neutral-500 text-sm font-medium mb-4">Identity Status</p>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xl">
                                👤
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Unverified</div>
                                <div className="text-xs text-neutral-500">Tier 0 Account</div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors">
                            Verify World ID
                        </button>
                    </div>

                </div>

                {/* FOOTER DISCRETO */}
                <footer className="mt-16 border-t border-white/5 pt-8 flex justify-between items-center text-xs text-neutral-600 font-mono">
                    <div>HUMANID.FI © 2026 // SYSTEM V1.0.4</div>
                    <div className="flex gap-6">
                        <span className="hover:text-neutral-400 cursor-pointer">Manifesto</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Contracts</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Privacy</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}

// SUB-COMPONENTES PARA MANTENER LA LIMPIEZA
function DataBadge({ label, value, status }: { label: string, value: string, status: 'live' | 'success' }) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-neutral-500 font-mono tracking-wider">{label}</span>
            <div className="flex items-center gap-2">
                {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                {status === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                <span className="text-sm font-medium text-neutral-300">{value}</span>
            </div>
        </div>
    )
}

function ListItem({ category, title, time, source }: any) {
    return (
        <div className="group flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <span className="px-2 py-1 rounded text-[10px] font-mono bg-white/5 text-neutral-400 border border-white/5 uppercase tracking-wide min-w-[80px] text-center">
                    {category}
                </span>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors line-clamp-1">
                    {title}
                </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-600">
                <span>{source}</span>
                <span>{time}</span>
            </div>
        </div>
    )
}
