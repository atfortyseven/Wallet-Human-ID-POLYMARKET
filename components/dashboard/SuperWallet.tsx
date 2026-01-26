
import React, { useState } from 'react';
import {
    Wallet, TrendingUp, Newspaper, ArrowRight, ArrowUpRight,
    ArrowDownLeft, Shield, AlertTriangle, Zap, CreditCard, Loader2
} from 'lucide-react';
// Asumiendo que usas Recharts para el gráfico
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Position, WalletState } from '@/types/wallet';
import { useRealWalletData } from '@/hooks/useRealWalletData';

// --- MOCK DATA FOR CHART (Aún mockeado hasta tener endpoint de historial de portfolio) ---
const MOCK_DATA = [
    { name: 'Mon', value: 1000 },
    { name: 'Tue', value: 1200 },
    { name: 'Wed', value: 1150 },
    { name: 'Thu', value: 1600 },
    { name: 'Fri', value: 1850 },
    { name: 'Sat', value: 1900 },
    { name: 'Sun', value: 2100 },
];

export default function SuperWallet({ recentNews = [] }: { recentNews?: any[] }) { // Acepte prop
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'POSITIONS' | 'ACTIVITY' | 'DEFI'>('OVERVIEW');

    // USAR EL HOOK DE DATOS REALES
    const {
        usdcBalance,
        totalBalance,
        portfolioValue,
        positions,
        transactions,
        isLoading,
        isConnected,
        address
    } = useRealWalletData(recentNews);

    // MANEJO DE ESTADOS DE CARGA Y CONEXIÓN
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 bg-black">
                <Wallet className="w-16 h-16 mb-6 opacity-30" />
                <h2 className="text-xl font-bold mb-2">Wallet Disconnected</h2>
                <p className="text-sm opacity-60">Connect your wallet to view your Polymarket dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-black min-h-screen text-white font-sans">

            {/* HEADER: GAS & STATUS */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className="flex items-center px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                        <Zap className="w-3 h-3 mr-1 fill-current" />
                        Polygon Mainnet
                    </span>
                </div>
            </div>

            {/* MAIN NAVIGATION TABS */}
            <div className="flex border-b border-gray-800 mb-6">
                {['OVERVIEW', 'POSITIONS', 'ACTIVITY', 'DEFI'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="space-y-6">

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="text-sm text-gray-500">Syncing blockchain & market data...</p>
                    </div>
                ) : (
                    <>
                        {/* TAB: OVERVIEW */}
                        {activeTab === 'OVERVIEW' && (
                            <>
                                <div className="h-48 w-full bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase tracking-wider">Total Net Worth</span>
                                            <div className="text-3xl font-bold text-white">${totalBalance}</div>
                                        </div>
                                        <div className="text-green-400 font-mono font-bold flex items-center">
                                            {/* Placeholder for chart change */}
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            <span>Live Data</span>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height="70%">
                                        <LineChart data={MOCK_DATA}>
                                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px' }}
                                                itemStyle={{ color: '#10b981' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* ACTION BUTTONS WITH REAL ON-RAMP */}
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    <button className="flex flex-col items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition text-white">
                                        <ArrowDownLeft className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-bold">Receive</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white">
                                        <ArrowUpRight className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-bold">Send</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://global.transak.com?defaultCryptoCurrency=USDC&network=polygon&walletAddress=${address}`, '_blank')}
                                        className="flex flex-col items-center justify-center p-3 bg-green-600 hover:bg-green-500 rounded-lg transition text-white col-span-2"
                                    >
                                        <CreditCard className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-bold">Buy USDC</span>
                                    </button >
                                </div >

                                <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Capital Breakdown</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-medium">Idle Cash (USDC)</div>
                                            <div className="text-2xl font-bold text-gray-200">${usdcBalance}</div>
                                        </div>
                                        <div className="h-16 w-px bg-gray-800 mx-4"></div>
                                        <div>
                                            <div className="text-white font-medium">Active Positions</div>
                                            <div className="text-2xl font-bold text-blue-400">${portfolioValue}</div>
                                            <div className="text-xs text-gray-400 mt-2">Across {positions.length} Markets</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* TAB: POSITIONS */}
                        {
                            activeTab === 'POSITIONS' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-white font-bold">Active Trades ({positions.length})</h3>
                                    </div>
                                    {positions.length === 0 ? (
                                        <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl text-gray-500">
                                            No active positions found on Polymarket.
                                        </div>
                                    ) : (
                                        positions.map(pos => (
                                            <div key={pos.id} className="bg-gray-800/50 p-4 rounded-lg mb-2 border border-gray-700 flex justify-between items-center group hover:bg-gray-800 transition">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.outcome === 'YES' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                            {pos.outcome}
                                                        </span>
                                                        <span className="text-white text-sm font-medium">{pos.marketTitle}</span>
                                                    </div>
                                                    <div className="text-gray-400 text-xs flex gap-3">
                                                        <span>{pos.shares.toFixed(1)} Shares</span>
                                                        <span className={pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {pos.newsContext && (
                                                        <div className="hidden md:flex items-center text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                                                            <Newspaper className="w-3 h-3 mr-1" />
                                                            <span>Linked: {pos.newsContext}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )
                        }

                        {/* TAB: ACTIVITY (REAL) */}
                        {
                            activeTab === 'ACTIVITY' && (
                                <div className="space-y-3">
                                    {transactions.length === 0 ? <p className="text-gray-500 text-center">No recent history.</p> : transactions.map((tx, index) => (
                                        <div key={index} className="bg-gray-900 p-4 rounded border border-gray-800 flex justify-between items-center">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${tx.type === 'SELL' ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
                                                    {tx.type === 'SELL' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">{tx.type} {tx.asset}</div>
                                                    <div className="text-gray-500 text-xs">{tx.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-mono font-bold">${tx.amount}</div>
                                                <div className="text-xs text-green-500">Confirmed</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }

                        {/* TAB: DEFI / YIELD */}
                        {
                            activeTab === 'DEFI' && (
                                <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
                                    <h3 className="text-gray-300 font-bold text-lg mb-2">Idle Cash Optimization</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                                        Connect to Aave V3 to earn yield on your uninvested USDC automatically.
                                    </p>
                                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition">
                                        Activate Smart Savings
                                    </button>
                                </div>
                            )
                        }
                    </>
                )}

            </div >
        </div >
    );
}

