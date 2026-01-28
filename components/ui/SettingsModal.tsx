'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/src/context/SettingsContext';
import {
    X, Settings, Shield, Zap, Database, Bell, Users,
    CreditCard, Beaker, Link, Info, MessageCircle, Lock,
    Eye, EyeOff, Trash2, Plus, Download, RefreshCw,
    ExternalLink, AlertTriangle, CheckCircle2, Copy
} from 'lucide-react';
import { toast } from 'sonner';

// --- MENU ITEMS ---
const SECTIONS = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Zap },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Sync', icon: Database },
    { id: 'walletconnect', label: 'WalletConnect', icon: Link },
    { id: 'buy', label: 'Buy Crypto', icon: CreditCard },
    { id: 'experimental', label: 'Experimental', icon: Beaker },
    { id: 'about', label: 'About', icon: Info },
];

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showSecret, setShowSecret] = useState(false);

    // Contacts Local State
    const [newContactName, setNewContactName] = useState('');
    const [newContactAddress, setNewContactAddress] = useState('');
    const [isAddingContact, setIsAddingContact] = useState(false);

    const {
        currency, setCurrency, language, setLanguage, searchEngine, setSearchEngine,
        hideBalances, toggleHideBalances, privacyMode, togglePrivacyMode, humanMetrics, toggleHumanMetrics, revealSecretPhrase,
        testNetsEnabled, toggleTestNets, ipfsGateway, setIpfsGateway, customRPC, setCustomRPC, stateLogsEnabled, toggleStateLogs, resetAccount,
        contacts, addContact, removeContact,
        notifications, toggleNotification, lockApp
    } = useSettings();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleAddContact = () => {
        if (!newContactName || !newContactAddress) return;
        addContact(newContactName, newContactAddress);
        setNewContactName('');
        setNewContactAddress('');
        setIsAddingContact(false);
        toast.success("Contact added");
    };

    // Renderizado condicional del contenido derecho
    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Currency Conversion</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as any)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ea] focus:ring-1 focus:ring-[#00f2ea] outline-none transition-all"
                                >
                                    <option value="USD">USD - United States Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="MXN">MXN - Mexican Peso</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2 ml-1">Current value displayed throughout the dashboard.</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">System Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ea] focus:ring-1 focus:ring-[#00f2ea] outline-none transition-all"
                                >
                                    <option value="en">English (US)</option>
                                    <option value="es">Español (Latam)</option>
                                    <option value="fr">Français</option>
                                    <option value="pt">Português</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Search Engine</label>
                                <select
                                    value={searchEngine}
                                    onChange={(e) => setSearchEngine(e.target.value as any)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ea] focus:ring-1 focus:ring-[#00f2ea] outline-none transition-all"
                                >
                                    <option value="Google">Google</option>
                                    <option value="DuckDuckGo">DuckDuckGo (Private)</option>
                                    <option value="Brave">Brave Search</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Secret Phrase Section */}
                        <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-50"><AlertTriangle className="text-amber-500" size={24} /></div>
                            <h4 className="text-amber-500 font-bold text-sm mb-2">Secret Recovery Phrase</h4>

                            {!showSecret ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-400">Your recovery phrase is the master key to your funds. Never share it with anyone.</p>
                                    <button
                                        onClick={() => setShowSecret(true)}
                                        className="bg-amber-500/10 text-amber-500 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-500/20 w-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16} /> Reveal Secret Phrase
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2 filter blur-sm hover:blur-none transition-all duration-300">
                                        {revealSecretPhrase().split(' ').map((word, i) => (
                                            <div key={i} className="bg-black/40 border border-amber-500/10 rounded px-2 py-1 text-center">
                                                <span className="text-[10px] text-gray-600 mr-2">{i + 1}</span>
                                                <span className="text-xs font-mono text-amber-200">{word}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(revealSecretPhrase())}
                                        className="bg-amber-500/10 text-amber-500 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-500/20 w-full flex items-center justify-center gap-2"
                                    >
                                        <Copy size={16} /> Copy to Clipboard
                                    </button>
                                    <button
                                        onClick={() => setShowSecret(false)}
                                        className="text-gray-500 text-xs text-center w-full hover:text-gray-300"
                                    >
                                        Hide Phrase
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Toggles */}
                        <div className="space-y-1">
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
                    </div>
                );

            case 'advanced':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <ToggleItem
                            title="Show Test Networks"
                            description="Select this to view test networks in your network list."
                            active={testNetsEnabled}
                            onClick={toggleTestNets}
                        />

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">IPFS Gateway</label>
                                <input
                                    type="text"
                                    value={ipfsGateway}
                                    onChange={(e) => setIpfsGateway(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00f2ea] outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Custom RPC URL</label>
                                <input
                                    type="text"
                                    value={customRPC}
                                    onChange={(e) => setCustomRPC(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00f2ea] outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h4 className="text-red-400 text-sm font-bold flex items-center gap-2">
                                <AlertTriangle size={16} /> Danger Zone
                            </h4>

                            <ToggleItem
                                title="State Logs"
                                description="Download state logs for support. Contains sensitive info."
                                active={stateLogsEnabled}
                                onClick={toggleStateLogs}
                            />

                            <button
                                onClick={resetAccount}
                                className="w-full py-3 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-colors"
                            >
                                Reset Account
                            </button>
                            <p className="text-xs text-gray-500 text-center">Reseting your account will clear your transaction history and local settings. It will not change your balances.</p>
                        </div>
                    </div>
                );

            case 'contacts':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {!isAddingContact ? (
                            <button
                                onClick={() => setIsAddingContact(true)}
                                className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-[#00f2ea] hover:border-[#00f2ea] transition-all text-sm font-medium flex items-center justify-center gap-2 group"
                            >
                                <div className="bg-white/5 p-1 rounded group-hover:bg-[#00f2ea]/20 transition-colors">
                                    <Plus size={16} />
                                </div>
                                Add New Contact
                            </button>
                        ) : (
                            <div className="bg-white/5 p-4 rounded-xl space-y-3 border border-white/10">
                                <input
                                    placeholder="Name"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                    value={newContactName}
                                    onChange={e => setNewContactName(e.target.value)}
                                />
                                <input
                                    placeholder="Ethereum Address (0x...)"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white outline-none font-mono"
                                    value={newContactAddress}
                                    onChange={e => setNewContactAddress(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddContact} className="flex-1 bg-[#00f2ea] text-black py-2 rounded-lg text-sm font-bold">Save</button>
                                    <button onClick={() => setIsAddingContact(false)} className="px-4 py-2 hover:bg-white/10 text-gray-400 rounded-lg text-sm">Cancel</button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {contacts.length === 0 && <p className="text-center text-gray-500 text-sm py-8">No contacts saved yet.</p>}
                            {contacts.map(contact => (
                                <div key={contact.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00f2ea]/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {contact.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">{contact.name}</p>
                                            <p className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                                {contact.address.substring(0, 6)}...{contact.address.substring(contact.address.length - 4)}
                                                <button onClick={() => handleCopy(contact.address)} className="hover:text-white"><Copy size={10} /></button>
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeContact(contact.id)} className="text-gray-600 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <ToggleItem
                            title="Governance Alerts"
                            description="Get notified when new proposals are created or passed."
                            active={notifications.governance}
                            onClick={() => toggleNotification('governance')}
                        />
                        <ToggleItem
                            title="Transaction Updates"
                            description="Notifications for incoming and outgoing transactions."
                            active={notifications.transactional}
                            onClick={() => toggleNotification('transactional')}
                        />
                        <ToggleItem
                            title="Security Alerts"
                            description="Critical security warnings and suspicious activity detections."
                            active={notifications.security}
                            onClick={() => toggleNotification('security')}
                        />
                    </div>
                );

            case 'walletconnect':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Link className="text-blue-500" size={32} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">No Active Sessions</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                                Connect to dApps using WalletConnect and manage your sessions here.
                            </p>
                        </div>
                    </div>
                );
            case 'buy':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed">
                                <h4 className="font-bold text-white">MoonPay</h4>
                                <p className="text-xs text-gray-500">Credit/Debit Card</p>
                            </div>
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed">
                                <h4 className="font-bold text-white">Transak</h4>
                                <p className="text-xs text-gray-500">Bank Transfer</p>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-4">Fiat on-ramps are disabled in this region.</p>
                    </div>
                );

            case 'backup':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="text-[#00f2ea]" size={20} />
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Sync Settings</div>
                                    <div className="text-xs text-gray-500">Last sync: Just now</div>
                                </div>
                            </div>
                        </button>

                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <Download className="text-purple-500" size={20} />
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Export to JSON</div>
                                    <div className="text-xs text-gray-500">Download a local backup</div>
                                </div>
                            </div>
                        </button>
                    </div>
                );

            case 'about':
                return (
                    <div className="text-center py-12 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto mb-6 shadow-2xl shadow-cyan-500/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">H</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">HumanID Wallet</h2>
                        <p className="text-gray-400 text-sm mb-8">Version 2.4.1 (Sovereign Edition)</p>

                        <div className="flex justify-center gap-4 text-xs text-gray-500">
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                );

            case 'experimental':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6">
                            <h4 className="text-purple-400 font-bold text-sm mb-1 flex items-center gap-2">
                                <Beaker size={16} /> Beta Features
                            </h4>
                            <p className="text-xs text-purple-200/60">Use these features at your own risk.</p>
                        </div>
                        <ToggleItem
                            title="Use 4337 Smart Accounts"
                            description="Enable gasless transactions via Account Abstraction."
                            active={false}
                            onClick={() => { }}
                        />
                        <ToggleItem
                            title="ZK-Proof Generator"
                            description="Generate client-side proofs for maximum privacy."
                            active={true}
                            onClick={() => { }}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 md:inset-auto md:top-10 md:bottom-10 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                                   w-full md:w-[900px] md:h-[700px] bg-[#0D0D12] border border-white/10 md:rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* LEFT SIDEBAR (Menu) */}
                        <div className="w-full md:w-64 bg-black/20 border-r border-white/5 flex flex-col">
                            <div className="p-6 border-b border-white/5 hidden md:block">
                                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                    <Settings className="text-[#00f2ea]" size={20} /> Settings
                                </h2>
                            </div>

                            <div className="flex-1 overflow-x-auto md:overflow-y-auto py-2 scrollbar-hide flex md:flex-col">
                                {SECTIONS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex-shrink-0 md:w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative group
                                            ${activeTab === item.id ? 'text-[#00f2ea] bg-[#00f2ea]/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                        `}
                                    >
                                        <item.icon size={18} className={activeTab === activeTab ? "opacity-100" : "opacity-70 group-hover:opacity-100"} />
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        {activeTab === item.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f2ea] rounded-r-full hidden md:block" />
                                        )}
                                        {activeTab === item.id && (
                                            <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#00f2ea] rounded-t-full md:hidden" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Actions Footer */}
                            <div className="p-4 border-t border-white/5 space-y-1 hidden md:block">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                    <MessageCircle size={18} /> Support
                                </button>
                                <button
                                    onClick={lockApp}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <Lock size={18} /> Lock Wallet
                                </button>
                            </div>
                        </div>

                        {/* RIGHT CONTENT (Dynamic) */}
                        <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D12]">
                            {/* Header Mobile Only */}
                            <div className="md:hidden flex justify-between items-center p-4 border-b border-white/5">
                                <h3 className="text-white font-bold">{SECTIONS.find(s => s.id === activeTab)?.label}</h3>
                                <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:flex justify-between items-center p-8 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {SECTIONS.find(s => s.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-sm text-gray-500">Manage your preferences and account settings.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                                {renderContent()}
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Utility Component for Toggles
function ToggleItem({ title, description, active, onClick }: { title: string, description: string, active: boolean, onClick: () => void }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={onClick}>
            <div>
                <h4 className="text-white text-sm font-medium mb-1 group-hover:text-[#00f2ea] transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 max-w-[80%]">{description}</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#00f2ea]' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
            </div>
        </div>
    );
}
