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
import TokenFlowVisualizer from '@/components/premium/TokenFlowVisualizer';
import GamificationSystem from '@/components/gamification/GamificationSystem';
import CompetitiveLeaderboard from '@/components/gamification/CompetitiveLeaderboard';
import RealTimeLiveFeed from '@/components/gamification/RealTimeLiveFeed';
import type { WatchedWallet } from '@/components/premium/WhaleTracker';

type TabType = 'tracker' | 'analytics' | 'alerts' | 'copytrading' | 'comparison' | 'gamification' | 'leaderboard';

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
    { id: 'tracker' as const, label: t('vip.tab_tracker'), icon: <Waves size={20} />, color: 'blue' },
    { id: 'analytics' as const, label: t('vip.tab_analytics'), icon: <BarChart3 size={20} />, color: 'purple' },
    { id: 'alerts' as const, label: t('vip.tab_alerts'), icon: <Bell size={20} />, color: 'orange' },
    { id: 'comparison' as const, label: t('vip.tab_compare'), icon: <TrendingUp size={20} />, color: 'pink' },
    // REMOVED: Copy Trading (fake transactions/traders), Leaderboard (fake rankings), My Progress (fake achievements)
  ];

  return (
    <div className="min-h-screen bg-[#EAEADF] text-[#1F1F1F] font-sans pb-20 relative overflow-hidden">
      {/* Premium Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          {/* Centered Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold">
              <Crown size={20} />
              {t('vip.badge')}
              {isPremium && <Sparkles size={16} className="animate-pulse" />}
            </div>
          </div>

          {/* Centered Title */}
          <h1 className="text-5xl md:text-7xl font-black text-[#1F1F1F] mb-4 leading-tight">
            {t('vip.title_track')}.
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('vip.title_copy')}.
            </span>
          </h1>

          {/* Centered Description */}
          <p className="text-xl text-[#1F1F1F]/70 max-w-2xl mx-auto">
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
        <div className="mb-6">
          <div className="flex gap-2 bg-white/50 p-2 rounded-2xl overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#1F1F1F] text-white shadow-lg scale-105'
                    : 'text-[#1F1F1F]/70 hover:bg-white/80'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
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
              <WhaleTracker isPremium={isPremium} onUpgrade={handleUpgrade} />
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

