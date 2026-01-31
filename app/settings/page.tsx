'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, Shield, Zap, Database, Bell, Users, 
    CreditCard, Beaker, Link, Info, MessageCircle, Lock, 
    Loader2, Check, ChevronRight
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HumanDefiFooter } from '@/components/landing/HumanDefiFooter';
import { useSettings } from '@/src/context/SettingsContext';
import { verifyBiometricOwnership } from '@/src/services/security/BiometricService';
import { revokeTokenAllowance } from '@/src/services/security/RevokeService';
import { ContactsManager } from '@/components/contacts/ContactsManager';
import { CloudSyncManager } from '@/components/settings/CloudSyncManager';
import { WalletConnectSessions } from '@/components/wallet/WalletConnectSessions';

export default function SettingsPage() {
    const {
        t, currency, setCurrency,
        language, setLanguage, searchEngine, setSearchEngine, lockApp,
        strictMode, toggleStrictMode, hideBalances, toggleHideBalances,
        privacyMode, togglePrivacyMode, humanMetrics, toggleHumanMetrics
    } = useSettings();

    const [activeTab, setActiveTab] = useState('general');
    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    const [revokeToken, setRevokeToken] = useState('');
    const [revokeSpender, setRevokeSpender] = useState('');
    const [isRevoking, setIsRevoking] = useState(false);

    const SECTIONS = [
        { id: 'general', label: t('nav_general'), icon: Settings },
        { id: 'security', label: t('nav_security'), icon: Shield },
        { id: 'advanced', label: t('nav_advanced'), icon: Zap },
        { id: 'contacts', label: t('nav_contacts'), icon: Users },
        { id: 'notifications', label: t('nav_notifications'), icon: Bell },
        { id: 'backup', label: t('nav_backup'), icon: Database },
        { id: 'walletconnect', label: t('nav_walletconnect'), icon: Link },
        { id: 'buy', label: t('nav_buy'), icon: CreditCard },
        { id: 'experimental', label: t('nav_experimental'), icon: Beaker },
        { id: 'about', label: t('nav_about'), icon: Info },
        { id: 'support', label: t('nav_support'), icon: MessageCircle },
    ];

    const toggleBiometrics = async () => {
        if (!biometricsEnabled) {
            const verified = await verifyBiometricOwnership();
            if (verified) {
                setBiometricsEnabled(true);
                toast.success("Biometrics Enabled");
            } else {
                toast.error("Biometric verification failed");
            }
        } else {
            setBiometricsEnabled(false);
        }
    };

    const handleRevoke = async () => {
        if (!revokeToken || !revokeSpender) return;
        setIsRevoking(true);
        try {
            const hash = await revokeTokenAllowance(revokeToken, revokeSpender);
            toast.success("Revocation TX Sent", { description: hash });
            setRevokeToken('');
            setRevokeSpender('');
        } catch (e: any) {
            toast.error("Revocation Failed", { description: e.message });
        } finally {
            setIsRevoking(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group p-6 bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl hover:shadow-lg transition-all">
                                <label className="text-sm font-bold text-[#1F1F1F]/60 block mb-3">{t('label_currency')}</label>
                                <div className="relative">
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as any)}
                                        className="w-full bg-white/50 border border-[#1F1F1F]/10 rounded-xl p-4 text-[#1F1F1F] focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none appearance-none font-medium"
                                    >
                                        <option value="USD">USD - United States Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="JPY">JPY - Japanese Yen</option>
                                        <option value="MXN">MXN - Mexican Peso</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                                        <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                                <p className="text-xs text-[#1F1F1F]/40 mt-3 font-medium">{t('desc_currency')}</p>
                            </div>

                            <div className="group p-6 bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl hover:shadow-lg transition-all">
                                <label className="text-sm font-bold text-[#1F1F1F]/60 block mb-3">{t('label_language')}</label>
                                <div className="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as any)}
                                        className="w-full bg-white/50 border border-[#1F1F1F]/10 rounded-xl p-4 text-[#1F1F1F] focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none appearance-none font-medium"
                                    >
                                        <option value="en">English (US)</option>
                                        <option value="es">Español (Latam)</option>
                                        <option value="fr">Français</option>
                                    </select>
                                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                                        <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="group p-6 bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl hover:shadow-lg transition-all md:col-span-2">
                                <label className="text-sm font-bold text-[#1F1F1F]/60 block mb-3">{t('label_search')}</label>
                                <div className="relative">
                                    <select
                                        value={searchEngine}
                                        onChange={(e) => setSearchEngine(e.target.value as any)}
                                        className="w-full bg-white/50 border border-[#1F1F1F]/10 rounded-xl p-4 text-[#1F1F1F] focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none appearance-none font-medium"
                                    >
                                        <option value="Google">Google</option>
                                        <option value="DuckDuckGo">DuckDuckGo (Private)</option>
                                        <option value="Brave">Brave Search</option>
                                    </select>
                                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                                        <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-4">
                            <ToggleItem
                                title="Biometric Authentication"
                                description="Require TouchID/FaceID to unlock wallet."
                                active={biometricsEnabled}
                                onClick={toggleBiometrics}
                            />
                            <ToggleItem
                                title="Strict Mode (Whitelist Only)"
                                description="Only allow transactions to saved contacts."
                                active={strictMode}
                                onClick={toggleStrictMode}
                            />
                            <ToggleItem
                                title="Hide Balances"
                                description="Mask all balance values with **** for privacy."
                                active={hideBalances}
                                onClick={toggleHideBalances}
                            />
                            <ToggleItem
                                title="Strict Privacy Mode"
                                description="Block third-party trackers and anonymize requests."
                                active={privacyMode}
                                onClick={togglePrivacyMode}
                            />
                            <ToggleItem
                                title="Participate in MetaMetrics"
                                description="Send anonymous usage data to help us improve."
                                active={humanMetrics}
                                onClick={toggleHumanMetrics}
                            />
                        </div>

                        {/* Revoke Allowance Section - Redesigned */}
                        <div className="p-8 bg-white/80 border border-rose-200 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Shield className="w-32 h-32 text-rose-500" />
                            </div>
                            
                            <h4 className="text-rose-600 font-black text-lg flex items-center gap-2 relative z-10">
                                <Shield className="w-5 h-5" /> Revoke Token Allowances
                            </h4>
                            <p className="text-sm text-[#1F1F1F]/60 relative z-10 max-w-md">
                                Emergency trigger to reset approval to 0. Use this if you suspect a malicious contract approval.
                            </p>

                            <div className="grid gap-4 relative z-10">
                                <input
                                    placeholder="Token Address (0x...)"
                                    value={revokeToken}
                                    onChange={e => setRevokeToken(e.target.value)}
                                    className="w-full bg-white border border-rose-100 rounded-xl p-4 text-sm text-[#1F1F1F] outline-none font-mono focus:border-rose-300 transition-colors"
                                />
                                <input
                                    placeholder="Spender Address (0x...)"
                                    value={revokeSpender}
                                    onChange={e => setRevokeSpender(e.target.value)}
                                    className="w-full bg-white border border-rose-100 rounded-xl p-4 text-sm text-[#1F1F1F] outline-none font-mono focus:border-rose-300 transition-colors"
                                />

                                <button
                                    onClick={handleRevoke}
                                    disabled={isRevoking || !revokeToken || !revokeSpender}
                                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                >
                                    {isRevoking ? <Loader2 className="animate-spin w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                    {isRevoking ? "REVOKING..." : "REVOKE ALLOWANCE"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'advanced':
                return (
                    <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem]">
                        <h3 className="text-[#1F1F1F] font-bold text-xl mb-4">RPC Configuration</h3>
                        <input disabled placeholder="https://mainnet.infura.io/v3..." className="w-full bg-white/50 p-4 rounded-xl border border-[#1F1F1F]/10 text-[#1F1F1F]/50 font-mono" />
                        <p className="text-xs text-[#1F1F1F]/40 mt-2">Custom RPCs are disabled in the current build for security stability.</p>
                    </div>
                );

            case 'contacts':
                return <ContactsManager />;

            case 'notifications':
                return (
                    <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] flex justify-between items-center">
                        <span className="font-bold text-[#1F1F1F]">Push Alerts</span>
                        <div className="w-12 h-7 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                             <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                );

            case 'backup':
                 return <CloudSyncManager />;

            case 'walletconnect':
                return <WalletConnectSessions />;

            case 'buy':
                return <EmptyState icon={CreditCard} label="Payment Gateway" subLabel="MoonPay Integration Loading..." />;

            case 'experimental':
                return (
                    <div className="p-8 text-center text-orange-600 border border-orange-200 bg-orange-50 rounded-[2rem]">
                        <Beaker size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="font-bold text-xl mb-2">Beta Features Enabled</h3>
                        <p className="text-sm opacity-80">You are running on the bleeding edge. Expect turbulence.</p>
                    </div>
                );

            case 'about':
                return (
                    <div className="text-center p-12 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white/60">
                        <div className="w-24 h-24 bg-[#1F1F1F] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <Info size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-[#1F1F1F] mb-2 tracking-tighter">HumanID.fi</h1>
                        <p className="text-[#1F1F1F]/60 font-mono text-sm">v2.4.1 (Sovereign Build)</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <span className="px-4 py-1 rounded-full bg-[#1F1F1F]/5 text-xs font-bold text-[#1F1F1F]/60">OPEN SOURCE</span>
                            <span className="px-4 py-1 rounded-full bg-[#1F1F1F]/5 text-xs font-bold text-[#1F1F1F]/60">AUDITED</span>
                        </div>
                    </div>
                );

            case 'support':
                return <EmptyState icon={MessageCircle} label="Contact Support" subLabel="Use the dedicated Support page for inquiries." />;
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans selection:bg-[#1F1F1F] selection:text-[#EAEADF] flex flex-col">
            <SiteHeader />
             
            {/* Background Noise/Void Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-black rounded-full blur-[130px]" />
            </div>

            <main className="flex-grow p-4 md:p-8 relative z-10 max-w-7xl mx-auto w-full pt-20 md:pt-32">
                <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
                    
                    {/* Sidebar / Topbar */}
                    <aside className="w-full md:w-80 flex-shrink-0 relative z-20">
                        <div className="sticky top-32">
                           <div className="mb-8 px-4">
                                <h1 className="text-4xl font-black tracking-tighter mb-2">Settings</h1>
                                <p className="text-[#1F1F1F]/60 font-medium">Control your sovereign parameters.</p>
                           </div>

                            <nav className="flex md:flex-col overflow-x-auto pb-4 md:pb-0 gap-3 md:gap-2 scrollbar-hide snap-x">
                                {SECTIONS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold transition-all group relative overflow-hidden whitespace-nowrap
                                            ${activeTab === item.id 
                                                ? 'bg-[#1F1F1F] text-white shadow-lg' 
                                                : 'bg-white/40 text-[#1F1F1F]/60 hover:bg-white/60'}
                                        `}
                                    >
                                        <item.icon size={18} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        <span className="relative z-10">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                             <div className="mt-8 px-4">
                                <button
                                    onClick={lockApp}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 hover:shadow-lg transition-all font-bold group border border-rose-200"
                                >
                                    <Lock size={18} className="group-hover:scale-110 transition-transform" /> 
                                    {t('btn_lock')}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-1">
                         <div className="bg-transparent md:p-6 min-h-full">
                             <div className="mb-8 md:hidden">
                                 <h2 className="text-2xl font-bold">{SECTIONS.find(s => s.id === activeTab)?.label}</h2>
                             </div>
                             
                             {renderContent()}
                         </div>
                    </section>
                </div>
            </main>

            <Toaster position="bottom-right" theme="light" />
            
            <div className="p-6 relative z-10">
                 <HumanDefiFooter />
            </div>
        </div>
    );
}

// Helper Components
function ToggleItem({ title, description, active, onClick }: { title: string, description: string, active: boolean, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="flex items-center justify-between p-6 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/40 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group" 
        >
            <div className="pr-4">
                <h4 className="text-[#1F1F1F] font-bold text-lg mb-1">{title}</h4>
                <p className="text-sm text-[#1F1F1F]/50 font-medium leading-relaxed">{description}</p>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner flex-shrink-0 ${active ? 'bg-[#1F1F1F]' : 'bg-[#1F1F1F]/10'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${active ? 'left-7' : 'left-1'}`}>
                     {active && <Check size={12} className="text-[#1F1F1F]" />}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, label, subLabel }: { icon: any, label: string, subLabel?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white/30 backdrop-blur-md rounded-[3rem] border border-dashed border-[#1F1F1F]/20">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl text-[#1F1F1F]/40">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#1F1F1F]/80 mb-2">{label}</h3>
            {subLabel && <p className="text-[#1F1F1F]/40 font-medium">{subLabel}</p>}
        </div>
    )
}
