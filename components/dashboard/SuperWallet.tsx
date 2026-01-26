import React, { useState } from 'react';
import {
    Wallet, TrendingUp, Newspaper, ArrowRight, ArrowUpRight,
    ArrowDownLeft, Shield, AlertTriangle, Zap, CreditCard
} from 'lucide-react';
// Asumiendo que usas Recharts para el gráfico
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Position, WalletState } from '@/types/wallet';

// --- MOCK DATA FOR DEMO ---
const MOCK_DATA = [
    { name: 'Mon', value: 1000 },
    { name: 'Tue', value: 1200 },
    { name: 'Wed', value: 1150 },
    { name: 'Thu', value: 1600 }, // News event spike
    { name: 'Fri', value: 1850 },
    { name: 'Sat', value: 1900 },
    { name: 'Sun', value: 2100 },
];

const MOCK_POSITIONS: Position[] = [
    {
        id: '1',
        marketTitle: 'Bitcoin hits $100k in 2024?',
        outcome: 'YES',
        shares: 500,
        avgPrice: 0.45,
        currentPrice: 0.60,
        pnl: 75,
        pnlPercent: 33.3,
        relatedNewsId: 'news_btc_etf'
    },
    {
        id: '2',
        marketTitle: 'Election Winner 2024',
        outcome: 'NO',
        shares: 200,
        avgPrice: 0.30,
        currentPrice: 0.25,
        pnl: -10,
        pnlPercent: -16.6,
    }
];

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx_1',
        type: 'SELL',
        amount: 500,
        asset: 'USDC',
        date: '2 mins ago',
        status: 'COMPLETED',
        newsContext: {
            newsId: 'news_123',
            headline: 'Fed cuts interest rates',
            impactLabel: 'News Triggered Sell'
        }
    },
    {
        id: 'tx_2',
        type: 'DEPOSIT',
        amount: 1000,
        asset: 'USDC',
        date: '1 day ago',
        status: 'COMPLETED'
    }
];

export default function SuperWallet() {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'POSITIONS' | 'ACTIVITY' | 'DEFI'>('OVERVIEW');
    const [walletState, setWalletState] = useState<WalletState>({
        balance: 2100.50,
        idleCash: 800.00,
        activeValue: 1300.50,
        yieldEnabled: false,
        isGasless: true
    });

    // --- SUB-COMPONENTS ---

    const PnLChart = () => (
        <div className="h-48 w-full bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Portfolio Value</span>
                    <div className="text-2xl font-bold text-white">${walletState.balance.toLocaleString()}</div>
                </div>
                <div className="text-green-400 font-mono font-bold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15.4% (7d)
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
    );

    const ActionButtons = () => (
        <div className="grid grid-cols-4 gap-2 mb-6">
            <button className="flex flex-col items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition text-white">
                <ArrowDownLeft className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Receive</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white">
                <ArrowUpRight className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Send</span>
            </button>
            {/* ON-RAMP INTEGRATION */}
            <button className="flex flex-col items-center justify-center p-3 bg-green-600 hover:bg-green-500 rounded-lg transition text-white col-span-2">
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Buy USDC</span>
            </button>
        </div>
    );

    const NewsVolatilityWidget = () => (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="text-yellow-500 text-sm font-bold">High Volatility Detected</h4>
                <p className="text-gray-400 text-xs mt-1">
                    Breaking news in <strong>"US Politics"</strong> is affecting your watchlist.
                    <span className="text-blue-400 cursor-pointer hover:underline ml-1">View Markets &rarr;</span>
                </p>
            </div>
        </div>
    );

    const PositionCard = ({ pos }: { pos: Position }) => (
        <div className="bg-gray-800/50 p-4 rounded-lg mb-2 border border-gray-700 flex justify-between items-center group hover:bg-gray-800 transition">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.outcome === 'YES' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {pos.outcome}
                    </span>
                    <span className="text-white text-sm font-medium">{pos.marketTitle}</span>
                </div>
                <div className="text-gray-400 text-xs flex gap-3">
                    <span>{pos.shares} Shares</span>
                    <span className={pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {pos.pnl >= 0 ? '+' : ''}{pos.pnlPercent}% ROI
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* NEWS INTELLIGENCE INDICATOR */}
                {pos.relatedNewsId && (
                    <div className="flex items-center text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                        <Newspaper className="w-3 h-3 mr-1" />
                        <span>News Driven</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-black min-h-screen text-white font-sans">

            {/* HEADER: GAS & STATUS */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
                <div className="flex items-center gap-2">
                    {walletState.isGasless && (
                        <span className="flex items-center px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                            <Zap className="w-3 h-3 mr-1 fill-current" />
                            Gasless Mode
                        </span>
                    )}
                    <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
                        <Shield className="w-4 h-4 text-gray-400" />
                    </button>
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

                {/* TAB: OVERVIEW */}
                {activeTab === 'OVERVIEW' && (
                    <>
                        <PnLChart />
                        <ActionButtons />
                        <NewsVolatilityWidget />

                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Capital Breakdown</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium">Idle Cash (USDC)</div>
                                    <div className="text-2xl font-bold text-gray-200">${walletState.idleCash}</div>
                                    {/* YIELD TOGGLE */}
                                    <div className="flex items-center mt-2 cursor-pointer group" onClick={() => setWalletState(p => ({ ...p, yieldEnabled: !p.yieldEnabled }))}>
                                        <div className={`w-8 h-4 rounded-full mr-2 transition-colors relative ${walletState.yieldEnabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${walletState.yieldEnabled ? 'translate-x-4' : ''}`} />
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-white transition">Earn ~4.5% APY via Aave</span>
                                    </div>
                                </div>
                                <div className="h-16 w-px bg-gray-800 mx-4"></div>
                                <div>
                                    <div className="text-white font-medium">Active Positions</div>
                                    <div className="text-2xl font-bold text-blue-400">${walletState.activeValue}</div>
                                    <div className="text-xs text-gray-400 mt-2">Across 2 Markets</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* TAB: POSITIONS */}
                {activeTab === 'POSITIONS' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">Active Trades</h3>
                            {/* PANIC BUTTON */}
                            <button className="px-3 py-1 bg-red-900/30 border border-red-800 text-red-400 text-xs font-bold rounded hover:bg-red-900/50 transition flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Panic Sell All
                            </button>
                        </div>
                        {MOCK_POSITIONS.map(pos => (
                            <PositionCard key={pos.id} pos={pos} />
                        ))}
                    </div>
                )}

                {/* TAB: ACTIVITY (With News Impact) */}
                {activeTab === 'ACTIVITY' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button className="text-xs text-gray-400 underline hover:text-white">Download CSV (Tax)</button>
                        </div>
                        <div className="space-y-3">
                            {MOCK_TRANSACTIONS.map(tx => (
                                <div key={tx.id} className="bg-gray-900 p-4 rounded border border-gray-800 flex justify-between items-center">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${tx.type === 'SELL' ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
                                            {tx.type === 'SELL' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">{tx.type} {tx.asset}</div>
                                            <div className="text-gray-500 text-xs">{tx.date}</div>

                                            {/* NEWS CONTEXT - THE KEY FEATURE */}
                                            {tx.newsContext && (
                                                <div className="mt-2 flex items-center bg-gray-800 p-1.5 rounded text-xs text-gray-300 border border-gray-700">
                                                    <Newspaper className="w-3 h-3 mr-2 text-blue-400" />
                                                    <span>{tx.newsContext.impactLabel}: </span>
                                                    <span className="ml-1 text-blue-400 italic">"{tx.newsContext.headline}"</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-mono font-bold">${tx.amount}</div>
                                        <div className="text-xs text-green-500">{tx.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: DEFI / YIELD */}
                {activeTab === 'DEFI' && (
                    <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
                        <h3 className="text-gray-300 font-bold text-lg mb-2">Idle Cash Optimization</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                            Connect to Aave V3 to earn yield on your uninvested USDC automatically.
                        </p>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition">
                            Activate Smart Savings
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
