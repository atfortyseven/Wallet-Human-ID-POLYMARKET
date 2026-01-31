'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { dictionary } from '@/src/lib/dictionary';

// --- TYPES ---
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'MXN';
export type Language = 'en' | 'es' | 'fr' | 'pt';
export type SearchEngine = 'Google' | 'DuckDuckGo' | 'Brave';

export interface Contact {
    id: string;
    name: string;
    address: string;
    memo?: string;
}

export interface SettingsContextType {
    // General
    currency: Currency;
    setCurrency: (c: Currency) => void;
    language: Language;
    setLanguage: (l: Language) => void;
    searchEngine: SearchEngine;
    setSearchEngine: (s: SearchEngine) => void;

    // Security & Privacy
    hideBalances: boolean;
    toggleHideBalances: () => void;
    privacyMode: boolean; // Hide data from 3rd parties
    togglePrivacyMode: () => void;
    humanMetrics: boolean; // "MetaMetrics"
    toggleHumanMetrics: () => void;
    strictMode: boolean; // Whitelist Only
    toggleStrictMode: () => void;
    revealSecretPhrase: () => string; // Mock

    // Advanced
    testNetsEnabled: boolean;
    toggleTestNets: () => void;
    ipfsGateway: string;
    setIpfsGateway: (url: string) => void;
    customRPC: string;
    setCustomRPC: (url: string) => void;
    stateLogsEnabled: boolean;
    toggleStateLogs: () => void;
    resetAccount: () => void;

    // Contacts
    contacts: Contact[];
    addContact: (name: string, address: string, memo?: string) => void;
    removeContact: (id: string) => void;

    // Notifications
    notifications: { governance: boolean; transactional: boolean; security: boolean; };
    toggleNotification: (type: 'governance' | 'transactional' | 'security') => void;

    // Helper Functions
    formatAmount: (amount: number) => string;
    lockApp: () => void;
    t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    // --- INITIAL STATES (With Persistence) ---
    // General
    const [currency, setCurrency] = useState<Currency>('USD');
    const [language, setLanguage] = useState<Language>('en');
    const [searchEngine, setSearchEngine] = useState<SearchEngine>('Google');

    // Security
    const [hideBalances, setHideBalances] = useState(false);
    const [privacyMode, setPrivacyMode] = useState(true);
    const [strictMode, setStrictMode] = useState(false);
    const [humanMetrics, setHumanMetrics] = useState(false);

    // Advanced
    const [testNetsEnabled, setTestNetsEnabled] = useState(false);
    const [ipfsGateway, setIpfsGateway] = useState('https://ipfs.io/ipfs/');
    const [customRPC, setCustomRPC] = useState('');
    const [stateLogsEnabled, setStateLogsEnabled] = useState(false);

    // Contacts
    const [contacts, setContacts] = useState<Contact[]>([
        { id: '1', name: 'Main Vault', address: '0x7883...7b4a' }
    ]);

    // Notifications
    const [notifications, setNotifications] = useState({
        governance: true,
        transactional: true,
        security: true
    });

    // --- CLERK AUTH ---
    const { user } = useUser();
    const session = { user };

    // --- LOAD SETTINGS (Hybrid: Local + Cloud) ---
    useEffect(() => {
        const loadSettings = async () => {
            // 1. Load from LocalStorage first (instant)
            const savedSettings = localStorage.getItem('humanid_settings_v2');
            if (savedSettings) {
                try {
                    const parsed = JSON.parse(savedSettings);
                    applySettings(parsed);
                } catch (e) { console.error("Failed to parse local settings", e); }
            }

            // 2. If logged in, fetch from Cloud (authoritative)
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/user/settings');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.settings && Object.keys(data.settings).length > 0) {
                            applySettings(data.settings);
                            // Merge with local storage for offline support
                             localStorage.setItem('humanid_settings_v2', JSON.stringify({
                                 ...JSON.parse(savedSettings || '{}'),
                                 ...data.settings
                             }));
                        }
                    }
                } catch (e) { console.error("Failed to sync cloud settings", e); }
            }
        };

        loadSettings();
    }, [session]);

    // Helper to apply settings object
    const applySettings = (parsed: any) => {
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.searchEngine) setSearchEngine(parsed.searchEngine);
        if (parsed.hideBalances !== undefined) setHideBalances(parsed.hideBalances);
        if (parsed.privacyMode !== undefined) setPrivacyMode(parsed.privacyMode);
        if (parsed.humanMetrics !== undefined) setHumanMetrics(parsed.humanMetrics);
        if (parsed.testNetsEnabled !== undefined) setTestNetsEnabled(parsed.testNetsEnabled);
        if (parsed.ipfsGateway) setIpfsGateway(parsed.ipfsGateway);
        if (parsed.customRPC) setCustomRPC(parsed.customRPC);
        if (parsed.stateLogsEnabled !== undefined) setStateLogsEnabled(parsed.stateLogsEnabled);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.notifications) setNotifications(parsed.notifications);
    };

    // --- AUTO SAVE (Debounced Cloud Sync) ---
    useEffect(() => {
        const settingsToSave = {
            currency, language, searchEngine,
            hideBalances, privacyMode, humanMetrics,
            testNetsEnabled, ipfsGateway, customRPC, stateLogsEnabled,
            contacts, notifications
        };
        
        // Always save to local
        localStorage.setItem('humanid_settings_v2', JSON.stringify(settingsToSave));

        // Save to cloud if logged in (Debounce 2s)
        if (session?.user?.email) {
            const timeoutId = setTimeout(async () => {
                try {
                    await fetch('/api/user/settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settingsToSave)
                    });
                } catch (e) {
                    console.error("Cloud save failed", e);
                }
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currency, language, searchEngine, hideBalances, privacyMode, humanMetrics, testNetsEnabled, ipfsGateway, customRPC, stateLogsEnabled, contacts, notifications, session]);

    // --- FUNCTIONS ---
    const toggleHideBalances = () => setHideBalances(prev => !prev);
    const togglePrivacyMode = () => setPrivacyMode(prev => !prev);
    const toggleStrictMode = () => setStrictMode(prev => !prev);
    const toggleHumanMetrics = () => setHumanMetrics(prev => !prev);

    const toggleTestNets = () => setTestNetsEnabled(prev => !prev);
    const toggleStateLogs = () => setStateLogsEnabled(prev => !prev);

    const resetAccount = () => {
        localStorage.removeItem('humanid_settings_v2');
        window.location.reload();
    };

    const revealSecretPhrase = () => {
        return "ocean crisp manual verify logic safe worry casual verify logic safe worry";
    };

    const addContact = (name: string, address: string, memo?: string) => {
        setContacts([...contacts, { id: Date.now().toString(), name, address, memo }]);
    };

    const removeContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const toggleNotification = (type: 'governance' | 'transactional' | 'security') => {
        setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const lockApp = () => {
        // Mock locking
        alert("🔒 SESSION LOCKED. Please re-authenticate.");
        window.location.reload();
    };

    const formatAmount = (amount: number) => {
        if (hideBalances) return '****';
        const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, MXN: 17.50 };
        // const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', MXN: '$' };
        const value = amount * (rates[currency] || 1);

        return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
            style: 'currency', currency: currency
        }).format(value);
    };

    const t = (key: string) => {
        // @ts-ignore
        return dictionary[language]?.[key] || dictionary['en'][key] || key;
    };

    return (
        <SettingsContext.Provider value={{
            currency, setCurrency, language, setLanguage, searchEngine, setSearchEngine,
            hideBalances, toggleHideBalances, privacyMode, togglePrivacyMode, strictMode, toggleStrictMode, humanMetrics, toggleHumanMetrics, revealSecretPhrase,
            testNetsEnabled, toggleTestNets, ipfsGateway, setIpfsGateway, customRPC, setCustomRPC, stateLogsEnabled, toggleStateLogs, resetAccount,
            contacts, addContact, removeContact,
            notifications, toggleNotification,
            formatAmount, lockApp, t
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within a SettingsProvider');
    return context;
};
