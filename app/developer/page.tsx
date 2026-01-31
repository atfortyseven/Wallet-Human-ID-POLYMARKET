'use client';

import { HumanDefiFooter } from "@/components/landing/HumanDefiFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useLanguage } from '@/src/context/LanguageContext';

export default function DeveloperPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-blue-500/30">
      <SiteHeader />
      
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-mono font-medium mb-6 uppercase tracking-wider border border-blue-500/20">
          {t('dev.hub')}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          {t('dev.title')}
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12">
          {t('dev.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          {[
            { title: t('dev.contracts.title'), desc: t('dev.contracts.desc') },
            { title: t('dev.sdk.title'), desc: t('dev.sdk.desc') },
            { title: t('dev.gov.title'), desc: t('dev.gov.desc') }
          ].map((item, i) => (
             <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-widest">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
             </div>
          ))}
        </div>
      </main>

      <div className="p-8">
        <HumanDefiFooter />
      </div>
    </div>
  );
}
