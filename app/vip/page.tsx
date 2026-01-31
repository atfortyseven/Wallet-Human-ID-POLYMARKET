"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Waves, BarChart3, Upload, Bell, Star, Sparkles, Brain, GitBranch, TrendingUp, Zap, Activity, Trophy } from 'lucide-react';
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
  const [isPremium, setIsPremium] = useState(true); // FORCE UNLOCKED 
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('tracker');
  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([]);

  // Check subscription status on mount (Mocked for full access)
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

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

  const tabs = [
    { id: 'tracker' as const, label: 'Whale Tracker', icon: <Waves size={20} />, color: 'blue' },
    { id: 'analytics' as const, label: 'Analytics', icon: <BarChart3 size={20} />, color: 'purple' },
    { id: 'alerts' as const, label: 'Smart Alerts', icon: <Bell size={20} />, color: 'orange' },
    { id: 'copytrading' as const, label: 'Copy Trading', icon: <GitBranch size={20} />, color: 'green' },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: <Trophy size={20} />, color: 'yellow' },
    { id: 'gamification' as const, label: 'My Progress', icon: <Crown size={20} />, color: 'pink' },
    { id: 'comparison' as const, label: 'Compare', icon: <TrendingUp size={20} />, color: 'pink' },
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
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold mb-4">
                <Crown size={20} />
                PROFESSIONAL WHALE TRACKER
                {isPremium && <Sparkles size={16} className="animate-pulse" />}
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-[#1F1F1F] mb-4 leading-tight">
                Track Whales.
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Copy Profits.
                </span>
              </h1>

              <p className="text-xl text-[#1F1F1F]/70 max-w-2xl">
                Professional-grade whale tracking with AI-powered insights, real-time alerts,
                and automated copy trading. Join 10,000+ traders making smarter decisions.
              </p>
            </div>

            {/* Removed Upgrade Button for Full Access */}
          </div>

          {/* Premium Stats */}
          {isPremium && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Activity />} label="Tracked Whales" value="247" change="+12" />
              <StatCard icon={<TrendingUp />} label="Copy Trade P&L" value="+$125K" change="+24%" />
              <StatCard icon={<Bell />} label="Active Alerts" value="18" change="+3" />
              <StatCard icon={<Zap />} label="Win Rate" value="85.7%" change="+2.1%" />
            </div>
          )}
        </motion.div>

        {/* Feature Highlights (Non-Premium) */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <HighlightCard
              icon={<Brain className="text-purple-500" size={32} />}
              title="AI-Powered Insights"
              features={['Pattern recognition', 'Profit predictions', 'Risk analysis', 'Auto recommendations']}
            />
            <HighlightCard
              icon={<GitBranch className="text-green-500" size={32} />}
              title="Copy Trading"
              features={['1-click copy trades', '85%+ win rate', 'Auto-execute', 'Risk management']}
            />
            <HighlightCard
              icon={<Bell className="text-orange-500" size={32} />}
              title="Real-Time Alerts"
              features={['Instant notifications', 'Telegram/Email/SMS', 'Custom rules', 'Smart filtering']}
            />
          </motion.div>
        )}

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

          {activeTab === 'copytrading' && (
            <motion.div
              key="copytrading"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TokenFlowVisualizer isPremium={isPremium} />
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <CompetitiveLeaderboard currentUserId={user?.id || 'guest'} />
                <RealTimeLiveFeed isPremium={isPremium} />
              </div>
            </motion.div>
          )}

          {activeTab === 'gamification' && (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GamificationSystem userId={user?.id || 'guest'} />
            </motion.div>
          )}

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

function HighlightCard({ icon, title, features }: {
  icon: React.ReactNode;
  title: string;
  features: string[];
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1F1F1F]/10 hover:shadow-xl transition-all"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-black text-[#1F1F1F] mb-3">{title}</h3>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#1F1F1F]/70">
            <Star size={16} className="text-yellow-500 fill-current flex-shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

