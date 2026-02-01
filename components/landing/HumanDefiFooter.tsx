"use client";

import React, { useState } from 'react';
import { Github, Twitter, Youtube, Instagram, Rss, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/src/context/LanguageContext';

// Custom icons for brands not in Lucide (Discord, TikTok, Reddit)
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
    </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
    </svg>
);

const RedditIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
);


export function HumanDefiFooter() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('footer.human_defi'),
            links: [
                { name: t('footer.get_wallet'), href: "/wallet" },
                { name: t('footer.buy'), href: "#" },
                { name: t('footer.earn'), href: "#" },
                { name: t('footer.redeem'), href: "#" },
                { name: t('footer.rewards'), href: "#" }
            ]
        },
        {
            title: t('footer.new').toUpperCase(),
            links: [
                { name: t('footer.predict'), href: "#" },
                { name: t('footer.perps'), href: "#" },
                { name: t('footer.shield'), href: "#" },
                { name: t('footer.snaps'), href: "#" }
            ]
        },
        {
            title: t('footer.products'),
            links: [
                { name: t('nav.human_card'), href: "/wallet" },
                { name: "Human USD", href: "/tokenomics" }, // Brand name
                { name: t('footer.smart_kit'), href: "#" },
                { name: t('footer.embedded'), href: "#" }
            ]
        },
        {
            title: t('footer.learn'),
            links: [
                { name: t('footer.developers'), href: "/developer" },
                { name: t('footer.docs'), href: "#" },
                { name: t('footer.dashboard'), href: "/dashboard" },
                { name: t('footer.sdk'), href: "#" },
                { name: t('footer.web3_services'), href: "#" }
            ]
        },
        {
            title: t('footer.about'),
            links: [
                { name: t('footer.security'), href: "#" },
                { name: t('footer.support' as any), href: "/soporte" },
                { name: t('footer.blog'), href: "#" },
                { name: t('footer.careers'), href: "#" },
                { name: t('footer.contact'), href: "#" }
            ]
        }
    ];

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSubscribed(true);
            toast.success(data.message || 'Successfully subscribed!');
            setEmail('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    const socialLinks = [
        { icon: <Twitter size={24} />, href: "https://x.com/antonioestt?t=R2chzvH1IOt18jYNM8epVw&s=09" },
        { icon: <Github size={24} />, href: "https://github.com/atfortyseven" },
        { icon: <Youtube size={24} />, href: "#" },
        { icon: <Instagram size={24} />, href: "https://www.instagram.com/antonioestt?igsh=YndraW8zcXQ4amls" },
        { icon: <DiscordIcon size={24} />, href: "#" },
        { icon: <RedditIcon size={24} />, href: "#" },
        { icon: <TikTokIcon size={24} />, href: "#" },
        { icon: <Rss size={24} />, href: "#" },
    ];

    return (
        <footer className="w-full bg-black/40 backdrop-blur-xl border-t border-white/10 py-16 px-4 mt-20 relative z-10">
            
            <div className="max-w-7xl mx-auto mb-16">
                
                {/* NEWSLETTER SECTION */}
                <div className="mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {t('footer.newsletter_title' as any) || "Mantente Actualizado"}
                            </h3>
                            <p className="text-gray-400 max-w-md text-sm">
                                {t('footer.newsletter_desc' as any) || "Recibe las últimas actualizaciones del ecosistema Human, lanzamientos y alertas directamente en tu correo."}
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input 
                                type="email" 
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading || subscribed}
                                className="bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-80 disabled:opacity-50"
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={loading || subscribed}
                                className={`
                                    flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                                    ${subscribed 
                                        ? 'bg-green-500 text-white cursor-default' 
                                        : 'bg-white text-black hover:bg-gray-200 active:scale-95'
                                    }
                                    disabled:opacity-80
                                `}
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : subscribed ? (
                                    <>
                                        <CheckCircle size={18} />
                                        <span>Suscrito</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Suscribirse</span>
                                        <Send size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                 {/* Language & Social Media Row */}
                 <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xl font-bold text-white mr-4 uppercase tracking-widest">{t('footer.lang_name')}</span>
                    {socialLinks.map((social, idx) => (
                        <a 
                            key={idx} 
                            href={social.href} 
                            className="
                                w-12 h-12 flex items-center justify-center 
                                bg-slate-200 hover:bg-white text-slate-900 
                                rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg
                            "
                        >
                            {social.icon}
                        </a>
                    ))}
                 </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-center md:text-left">
                {sections.map((section, i) => (
                    <div key={i}>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{section.title}</h4>
                        <ul className="space-y-4">
                            {section.links.map((link, j) => (
                                <li key={j}>
                                    <a href={link.href} className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs font-mono tracking-tighter">
                <p>&copy; {t('footer.rights')}</p>
                <div className="flex gap-6 mt-4 md:mt-0 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
                    <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
                </div>
            </div>
        </footer>
    );
}
