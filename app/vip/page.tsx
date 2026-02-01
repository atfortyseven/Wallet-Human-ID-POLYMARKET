"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Waves, BarChart3, Bell, Sparkles, TrendingUp, Zap, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import WhaleTracker from '@/components/premium/WhaleTracker';
import WalletComparison from '@/components/premium/WalletComparison';
import PricingModal from '@/components/premium/PricingModal';
import AdvancedAnalytics from '@/components/premium/AdvancedAnalytics';
import SmartAlertsEngine from '@/components/premium/SmartAlertsEngine';
import CryptoNewsFeed from '@/components/premium/CryptoNewsFeed';
import NotificationSettings from '@/components/premium/NotificationSettings';
import TokenFlowVisualizer from '@/components/premium/TokenFlowVisualizer';
import GamificationSystem from '@/components/gamification/GamificationSystem';
import CompetitiveLeaderboard from '@/components/gamification/CompetitiveLeaderboard';
import RealTimeLiveFeed from '@/components/gamification/RealTimeLiveFeed';
import { FloatingImmersiveBackground } from '@/components/landing/FloatingImmersiveBackground';
import type { WatchedWallet } from '@/components/premium/WhaleTracker';

type TabType = 'tracker' | 'analytics' | 'alerts' | 'news' | 'notifications' | 'comparison';

export default function VIPPage() {
  const { user, isLoaded } = useUser();
  const { t } = useLanguage(); // Add translation support
  const [isPremium, setIsPremium] = useState(true); // FORCE UNLOCKED 
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('tracker');
  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([]);
  
  // Real stats from API
  const [stats, setStats] = useState({
    trackedWhales: 3, // Start with our initial 3 wallets
    totalValue: 0,
    activeAlerts: 0,
    activities: 0
  });

  // Update stats when watched wallets change
  const handleWalletsUpdate = (wallets: WatchedWallet[]) => {
    setWatchedWallets(wallets);
    const totalValue = wallets.reduce((sum, wallet) => sum + wallet.totalValue, 0);
    setStats(prev => ({
      ...prev,
      trackedWhales: wallets.length,
      totalValue
    }));
  };

  // Check subscription status on mount (Mocked for full access)
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch whale activities to count
        const activitiesRes = await fetch('/api/whale/activities');
        const activitiesData = await activitiesRes.json();
        
        setStats(prev => ({
          ...prev,
          activities: activitiesData.activities?.length || 0
        }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (isPremium) {
      fetchStats();
      const interval = setInterval(fetchStats, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [isPremium]);

  const handleUpgrade = async () => {
    setShowPricing(true);
  };

  const handleSubscribe = async (tier: 'monthly' | 'yearly') => {
    try {
      // Create Stripe checkout session
      const priceId = tier === 'monthly' 
        ? 'price_1234567890' // Replace with your actual Stripe price ID
        : 'price_0987654321'; // Replace with your actual Stripe price ID
      
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#EAEADF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  // Only keep tabs with REAL data
  const tabs = [
    { id: 'tracker' as const, label: t('vip.tab_tracker'), icon: <Waves size={20} />, color: 'blue', badge: '5 Chains' },
    { id: 'analytics' as const, label: t('vip.tab_analytics'), icon: <BarChart3 size={20} />, color: 'purple', isNew: true },
    { id: 'alerts' as const, label: t('vip.tab_alerts'), icon: <Bell size={20} />, color: 'orange' },
    { id: 'news' as const, label: 'AI News', icon: <Sparkles size={20} />, color: 'green', isNew: true },
    { id: 'notifications' as const, label: 'Notifications', icon: <Zap size={20} />, color: 'cyan', isNew: true },
    { id: 'comparison' as const, label: t('vip.tab_compare'), icon: <TrendingUp size={20} />, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans pb-20 relative overflow-hidden">
      {/* Premium Background Effect */}
      <FloatingImmersiveBackground density="low" kittenCount={2} />
      
      {/* WHALE BACKGROUND - SOFT & IMMERSIVE */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* The Whale Image with Radial Mask to hide edges */}
        <div 
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-contain bg-center bg-no-repeat opacity-40 blur-2xl"
            style={{
                backgroundImage: 'url(/models/photo_2026-01-31_23-41-05.jpg)',
                maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
            }}
        />
        {/* Additional tint/blur layers */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          {/* Centered Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border border-[#D4AF37] rounded-full text-[#D4AF37] font-black tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.15)] z-20 relative">
              <Crown size={22} />
              <span className="text-sm uppercase">THE IMMERSIVE WHALE ALERT</span>
              {isPremium && <Sparkles size={18} className="animate-pulse" />}
            </div>
          </div>

          {/* Centered Title - Stately & Bold */}
          <h1 className="text-5xl md:text-7xl font-black text-[#1F1F1F] mb-6 leading-tight tracking-tighter uppercase relative z-20">
            INFORMATE CON LAS MEJORES SEÑALES <br/>
            <span className="bg-gradient-to-b from-[#1F1F1F] to-[#D4AF37] bg-clip-text text-transparent">
               CON NUESTRA QUERIDA BALLENA
            </span>
          </h1>

          {/* Centered Description */}
          <p className="text-lg text-[#1F1F1F]/60 max-w-3xl mx-auto font-medium leading-relaxed tracking-wide italic">
            {t('vip.desc')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <StatCard icon={<Activity />} label="Tracked Whales" value={stats.trackedWhales.toString()} change="Live" />
            <StatCard icon={<TrendingUp />} label="Total Value" value={stats.totalValue > 0 ? `$${(stats.totalValue / 1e6).toFixed(2)}M` : "Cargando..."} change="Real-time" />
            <StatCard icon={<Bell />} label="Activities (24h)" value={stats.activities.toString()} change="Live" />
            <StatCard icon={<Zap />} label="Network" value="Base" change="Mainnet" />
          </div>
        </motion.div>



        {/* Tab Navigation */}
        <div className="mb-6 relative z-20">
          <div className="flex gap-2 bg-white/50 p-2 rounded-2xl overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'bg-[#1F1F1F] text-white shadow-lg scale-105'
                    : 'text-[#1F1F1F]/70 hover:bg-white/80'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
                
                {/* NEW badge */}
                {(tab as any).isNew && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-black animate-pulse">
                    NEW
                  </span>
                )}
                
                {/* Multi-chain badge */}
                {(tab as any).badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#1F1F1F]/10 text-[#1F1F1F]'
                  }`}>
                    {(tab as any).badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WhaleTracker isPremium={isPremium} onUpgrade={handleUpgrade} onWalletsUpdate={handleWalletsUpdate} />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AdvancedAnalytics 
                walletAddress="0x28C6c06298d514Db089934071355E5743bf21d60" 
                isPremium={isPremium} 
              />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SmartAlertsEngine isPremium={isPremium} />
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CryptoNewsFeed isPremium={isPremium} />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <NotificationSettings />
            </motion.div>
          )}

          {/* REMOVED FAKE DATA TABS:
            - Copy Trading (fake transactions, traders, P&L)
            - Leaderboard (fake rankings, win rates)
            - Gamification/My Progress (fake achievements, points)
          */}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WalletComparison wallets={watchedWallets} isPremium={isPremium} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky upgrade banner removed */}
      </div>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <PricingModal
            isOpen={showPricing}
            onClose={() => setShowPricing(false)}
            onSubscribe={handleSubscribe}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, change }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-[#1F1F1F]/10"
    >
      <div className="flex items-center gap-2 mb-2 text-[#1F1F1F]/70">
        {icon}
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <div className="text-2xl font-black text-[#1F1F1F]">{value}</div>
      <div className="text-sm font-bold text-green-600 mt-1">{change}</div>
    </motion.div>
  );
}

