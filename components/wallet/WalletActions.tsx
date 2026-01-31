"use client";

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Repeat, CreditCard, LayoutGrid, Image as ImageIcon, History, Loader2, TrendingUp, ExternalLink } from 'lucide-react';
import { useAccount, useChainId, useReadContracts, useBalance } from 'wagmi';
import { formatUnits, erc20Abi } from 'viem';
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection';
import { SecurityGrowthSection } from '@/components/landing/SecurityGrowthSection';
import SendModal from '@/components/wallet/SendModal';
import ReceiveModal from '@/components/wallet/ReceiveModal';
import SwapModal from '@/components/wallet/SwapModal';
import { getSupportedTokens, TOKENS_BY_CHAIN } from '@/config/tokens';
import { toast } from 'sonner';
import { Position, Transaction } from '@/types/wallet';

interface WalletActionsProps {
    positions?: Position[];
    history?: Transaction[];
}

export function WalletActions({ positions = [], history = [] }: WalletActionsProps) {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const [activeTab, setActiveTab] = useState('Tokens');

    // Modals
    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
    const [showSwap, setShowSwap] = useState(false);

    // Tokens Data
    // Defensive coding: Handle case where getSupportedTokens import might be undefined at runtime due to circular deps or build issues
    const supportedTokens: { symbol: string; name: string; address: string; decimals: number; icon?: string }[] = 
        (typeof getSupportedTokens === 'function' ? getSupportedTokens(chainId) : TOKENS_BY_CHAIN?.[chainId]) || [];
    
    // Construct contract calls for all supported tokens
    const { data: tokenBalances, isLoading: isLoadingTokens } = useReadContracts({
        contracts: supportedTokens.map((t) => ({
            address: t.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
            chainId
        })),
        query: {
            enabled: !!address && supportedTokens.length > 0
        }
    });

    // Native Balance
    const { data: nativeBalance } = useBalance({ address });

    // Process balances
    const tokens = supportedTokens.map((t, i) => {
        const result = tokenBalances?.[i]?.result as unknown; // Fix implicit any
        const bal = typeof result === 'bigint' ? result : BigInt(0);
        return {
            ...t,
            rawBalance: bal,
            formatted: bal ? formatUnits(bal, t.decimals) : "0",
            value: 0 // Mock value (needs price feed)
        };
    }).filter((t) => parseFloat(t.formatted) > 0);
    // Add Native to list if needed, or just show ERC20s in the list as "Tokens" usually implies. 
    // Usually Native is header, specific list is tokens. Stick to ERC20s for the list or include native if desired.

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Filter Logic
    const filteredTokens = tokens.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPositions = positions.filter((p) => 
        p.marketTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.outcome?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter history logic (assuming history items have type/asset)
    const filteredHistory = history.filter((h) => 
        h.asset?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ACTIONS = [
        { 
            label: 'Comprar', 
            icon: <CreditCard size={24} />, 
            color: 'bg-blue-600 hover:bg-blue-500',
            action: () => window.open('https://app.metamask.io/buy/build-quote', '_blank')
        },
        { 
            label: 'Intercambio', 
            icon: <Repeat size={24} />, 
            color: 'bg-zinc-700 hover:bg-zinc-600',
            action: () => setShowSwap(true)
        },
        { 
            label: 'Enviar', 
            icon: <ArrowUpRight size={24} />, 
            color: 'bg-zinc-700 hover:bg-zinc-600',
            action: () => setShowSend(true)
        },
        { 
            label: 'Recibir', 
            icon: <ArrowDownLeft size={24} />, 
            color: 'bg-zinc-700 hover:bg-zinc-600',
            action: () => setShowReceive(true)
        },
    ];

    const TABS = [
        { id: 'Tokens', label: 'Tokens' },
        { id: 'DeFi', label: 'DeFi' },
        { id: 'NFT', label: 'NFT' }
    ];

    return (
        <div className="w-full">
            {/* Modals */}
            <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
            <ReceiveModal isOpen={showReceive} onClose={() => setShowReceive(false)} />
            <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

            {/* 4 Action Buttons - Premium Squircle Design */}
            <div className="grid grid-cols-4 gap-4 mb-10 max-w-lg mx-auto">
                {ACTIONS.map((action) => (
                    <button 
                        key={action.label}
                        onClick={action.action}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className={`
                            w-16 h-16 rounded-[24px] 
                            flex items-center justify-center text-white 
                            shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] 
                            transition-all duration-300 ease-out
                            group-hover:scale-110 group-hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.2)]
                            group-active:scale-95
                            ${action.label === 'Comprar' ? 'bg-blue-600' : 'bg-neutral-800'}
                        `}>
                            {action.icon}
                        </div>
                        <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tabs Navigation - Minimalist */}
            <div className="flex border-b border-neutral-200/60 mb-8 mx-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex-1 py-4 text-sm font-bold text-center relative transition-colors tracking-wide
                            ${activeTab === tab.id ? 'text-blue-600' : 'text-neutral-400 hover:text-neutral-600'}
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            {(activeTab === 'Tokens' || activeTab === 'DeFi') && (
                <div className="px-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Search assets..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-400"
                    />
                </div>
            )}

            {/* Content Area */}
            <div className="min-h-[400px] animate-fade-in relative z-10">
                {activeTab === 'Tokens' && (
                    <div className="px-4">
                        {!isConnected ? (
                             <div className="text-center py-16 text-neutral-400 text-sm">
                                <p>Wallet connection required for token details.</p>
                            </div>
                        ) : isLoadingTokens ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-neutral-400" />
                            </div>
                        ) : filteredTokens.length === 0 && (!nativeBalance || parseFloat(nativeBalance.formatted) === 0) ? (
                            <div className="text-center py-16 text-neutral-400 text-sm">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                                    <LayoutGrid size={24} />
                                </div>
                                <p className="font-medium">No tokens found.</p>
                                <button className="mt-4 text-blue-600 hover:text-blue-700 font-bold hover:underline">Import tokens</button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Always show Native Token First if matches search */}
                                {nativeBalance && parseFloat(nativeBalance.formatted) > 0 && (nativeBalance.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || "native".includes(searchQuery.toLowerCase())) && (
                                    <div className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold">
                                                {nativeBalance.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900">{nativeBalance.symbol}</div>
                                                <div className="text-xs text-neutral-500">Native Token</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-neutral-900">{parseFloat(nativeBalance.formatted).toFixed(4)}</div>
                                            <div className="text-xs text-neutral-500">$0.00</div>
                                        </div>
                                    </div>
                                )}
                                {/* ERC20s */}
                                {filteredTokens.map((token, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {token.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900">{token.name}</div>
                                                <div className="text-xs text-neutral-500">{token.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-neutral-900">{parseFloat(token.formatted).toFixed(4)}</div>
                                            {/* Price placeholder */}
                                            <div className="text-xs text-neutral-500">$0.00</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                 {activeTab === 'DeFi' && (
                    <div className="px-4">
                        {positions && filteredPositions.length > 0 ? (
                            <div className="grid gap-3">
                                {filteredPositions.map((pos: any, idx) => (
                                    <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-4 hover:shadow-lg transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${pos.outcome === 'YES' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {pos.outcome}
                                                </span>
                                                <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{pos.marketTitle}</h4>
                                            </div>
                                            <ExternalLink size={14} className="text-neutral-400 group-hover:text-blue-500" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-xs text-neutral-500 mb-0.5">Value</div>
                                                <div className="font-mono font-bold text-neutral-900">${pos.value?.toFixed(2)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs font-bold ${pos.pnl >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                                     {pos.pnl >= 0 ? '+' : ''}{pos.pnl?.toFixed(2)} ({pos.pnlPercent?.toFixed(1)}%)
                                                </div>
                                                <div className="text-[10px] text-neutral-400">{pos.shares?.toFixed(1)} Shares</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-neutral-400 text-sm">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="font-medium">No results found.</p>
                            </div>
                        )}
                    </div>
                )}
                 {activeTab === 'NFT' && (
                    <div className="text-center py-16 text-neutral-400 text-sm">
                         <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                             <ImageIcon size={24} />
                        </div>
                        <p className="font-medium">No NFTs in this wallet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
