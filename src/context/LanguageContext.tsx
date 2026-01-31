"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish as the user communicates in Spanish
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('human_defi_lang') as Language;
        if (saved && (saved === 'en' || saved === 'es')) {
            setLanguageState(saved);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('human_defi_lang', lang);
    };

    const toggleLanguage = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
    };

    const t = (key: TranslationKey) => {
        // Fallback to English if key doesn't exist in current language, logic can be improved
        // @ts-ignore
        return translations[language][key] || translations['en'][key] || key;
    };

    // We must render the provider even if not mounted, otherwise components using useLanguage will fail during SSR/Build
    // if (!mounted) {
    //    return <>{children}</>; 
    // }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
