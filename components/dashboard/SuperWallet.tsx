"use client";

import React, { useState } from 'react';
import { Wallet, TrendingUp, Zap, Loader2, PieChart, Users, Settings } from 'lucide-react';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { WalletActions } from '@/components/wallet/WalletActions';
import { useRealWalletData } from '@/hooks/useRealWalletData';
import PortfolioDashboard from '@/components/wallet/PortfolioDashboard';
import SettingsPanel from '@/components/wallet/SettingsPanel';
import AddressBook from '@/components/wallet/AddressBook';
import AccountSwitcher from '@/components/wallet/AccountSwitcher';
import { getAccountColor } from '@/lib/wallet/accounts';

export default function SuperWallet({ recentNews = [] }: { recentNews?: any[] }) {
    
    // Data Hook (Real Logic)
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

    const [activeView, setActiveView] = useState<'dashboard' | 'portfolio' | 'contacts' | 'settings'>('dashboard');

    // Mock accounts for UI demo (since we don't have the full provider yet)
    const accounts = address ? [{
        address: address,
        name: 'Main Wallet',
        type: 'PRIMARY' as const
    }] : [];

    // Always show the wallet interface
    return (
        <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans selection:bg-[#1F1F1F] selection:text-[#EAEADF] pb-20 relative overflow-hidden">
             {/* Background Noise/Void Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black rounded-full blur-[120px]" />
            </div>

            {/* Header Navigation */}
            <header className="px-4 py-4 md:px-6 flex items-center justify-between sticky top-0 z-30 bg-[#EAEADF]/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    {address && (
                        <AccountSwitcher 
                            currentAddress={address}
                            accounts={accounts}
                            onSwitch={() => {}}
                            onAddAccount={() => {}}
                            onAddWatchOnly={() => {}}
                        />
                    )}
                </div>
                
                <div className="flex bg-white/50 rounded-full p-1.5 border border-[#1F1F1F]/5 shadow-sm">
                    <ViewTab icon={<Wallet size={18}/>} label="Wallet" active={activeView==='dashboard'} onClick={()=>setActiveView('dashboard')} />
                    <ViewTab icon={<PieChart size={18}/>} label="Portfolio" active={activeView==='portfolio'} onClick={()=>setActiveView('portfolio')} />
                    <ViewTab icon={<Users size={18}/>} label="Contacts" active={activeView==='contacts'} onClick={()=>setActiveView('contacts')} />
                    <ViewTab icon={<Settings size={18}/>} label="Settings" active={activeView==='settings'} onClick={()=>setActiveView('settings')} />
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8 relative z-10 min-h-[80vh]">

                {activeView === 'dashboard' && (
                    <div className="animate-fade-in">
                        {/* Balance Section */}
                        <div className="text-center space-y-2 py-8 animate-fade-in-up">
                            <h2 className="text-[#1F1F1F]/60 font-medium text-sm uppercase tracking-widest">Total Balance</h2>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-5xl md:text-6xl font-black text-[#1F1F1F] tracking-tighter">
                                    ${totalBalance}
                                </span>
                            </div>
                            
                            {/* 24h Change Badge - Remove green color */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-[#1F1F1F] text-sm font-bold border border-[#1F1F1F]/10 shadow-sm">
                                 <TrendingUp size={14} />
                                 <span>+$0.00 (0.00%)</span> {/* Mock currently, as per instruction to leave structure ready */}
                            </div>
                        </div>

                        {/* Wallet Actions & Tabs */}
                        <WalletActions positions={positions} history={transactions} />
                    </div>
                )}

                {activeView === 'portfolio' && address && (
                    <div className="animate-fade-in">
                        <PortfolioDashboard walletAddress={address} chainIds={[1, 137]} />
                    </div>
                )}

                {activeView === 'contacts' && address && (
                    <div className="animate-fade-in">
                        <AddressBook authUserId={address} />
                    </div>
                )}

                {activeView === 'settings' && (
                    <div className="animate-fade-in">
                        <SettingsPanel />
                    </div>
                )}

            </main>
        </div>
    );
}


function ViewTab({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button 
           onClick={onClick}
           className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${active ? 'bg-[#1F1F1F] text-[#EAEADF] shadow-md' : 'text-[#1F1F1F]/50 hover:bg-white/80'}`}
           title={label}
        >
            {icon}
            {active && <span className="text-xs font-bold pr-1 hidden md:block">{label}</span>}
        </button>
    )
}


