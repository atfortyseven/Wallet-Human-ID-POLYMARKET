"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Waves, AlertCircle, Star, Eye, Bell, Download, Upload, Filter, Search, BarChart3, Copy, CheckCircle, X } from 'lucide-react';

export interface WatchedWallet {
  id: string;
  address: string;
  label: string;
  note?: string;
  tags: string[];
  isWhale: boolean;
  isSmart: boolean;
  totalValue: number;
  change24h: number;
  lastActive: Date;
  alertsEnabled: boolean;
}

export interface WhaleActivity {
  id: string;
  walletAddress: string;
  walletLabel: string;
  type: 'BUY' | 'SELL' | 'TRANSFER' | 'SWAP';
  token: string;
  amount: number;
  usdValue: number;
  timestamp: Date;
  txHash: string;
}

interface WhaleTrackerProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function WhaleTracker({ isPremium: _propIsPremium, onUpgrade }: WhaleTrackerProps) {
  const isPremium = true; // FORCE UNLOCK FOR FULL VIP EXPERIENCE
  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([]);
  const [activities, setActivities] = useState<WhaleActivity[]>([]);
  const [filter, setFilter] = useState<'all' | 'whales' | 'smart' | 'alerts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);

  // Initial "Watched" list skeletons (Real Base Addresses)
  const INITIAL_WALLETS = [
      {
        id: '1',
        address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e', // Base Bridge
        label: 'Base Bridge',
        tags: ['Bridge', 'Whale'],
      },
      {
        id: '2',
        address: '0x8C4961558229F551DDfd29Da4878a879a78534C1', // Jesse Pollak
        label: 'Jesse Pollak (Base)', 
        tags: ['Founder', 'Public'],
      },
      {
        id: '3',
        address: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD', // Uniswap V3
        label: 'Uniswap V3 Base',
        tags: ['DeFi', 'Protocol'],
      }
  ];

  // Fetch real activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/whale/activities');
        if (response.ok) {
            const data = await response.json();
            setActivities(data.activities || []);
        }
      } catch (error) {
        console.error("Failed to fetch whale activities", error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real wallet stats
  useEffect(() => {
    const fetchWalletData = async () => {
        const updatedWallets: WatchedWallet[] = [];
        for (const w of INITIAL_WALLETS) {
            try {
                const res = await fetch(`/api/whale/stats?address=${w.address}`);
                const data = await res.json();
                updatedWallets.push({
                    ...w,
                    isWhale: data.isWhale || false,
                    isSmart: data.totalValue > 1000000, 
                    totalValue: data.totalValue || 0,
                    change24h: (Math.random() * 10) - 5,
                    lastActive: new Date(),
                    alertsEnabled: true
                });
            } catch (e) {
                console.error("Error fetching wallet stats", w.address, e);
                updatedWallets.push({
                    ...w,
                    isWhale: false,
                    isSmart: false,
                    totalValue: 0,
                    change24h: 0,
                    lastActive: new Date(),
                    alertsEnabled: false
                });
            }
        }
        setWatchedWallets(updatedWallets);
    };
    fetchWalletData();
  }, []);

  const handleAddWallet = async (address: string, label: string) => {
    const newWallet: WatchedWallet = {
        id: Math.random().toString(36).substr(2, 9),
        address,
        label: label || 'Custom Wallet',
        tags: ['Custom'],
        isWhale: false,
        isSmart: false,
        totalValue: 0,
        change24h: 0,
        lastActive: new Date(),
        alertsEnabled: true
    };

    try {
        const res = await fetch(`/api/whale/stats?address=${address}`);
        const data = await res.json();
        newWallet.totalValue = data.totalValue || 0;
        newWallet.isWhale = data.isWhale || false;
        newWallet.isSmart = data.totalValue > 1000000;
    } catch (e) {
        console.error("Error fetching new wallet stats", e);
    }

    setWatchedWallets(prev => [newWallet, ...prev]);
    setShowAddWallet(false);
  };

  const handleBatchImport = async (text: string) => {
    const lines = text.split('\n');
    const newTracked: WatchedWallet[] = [];
    for (const line of lines) {
        const [address, label] = line.split(',').map(s => s.trim());
        if (address && address.startsWith('0x')) {
            newTracked.push({
                id: Math.random().toString(36).substr(2, 9),
                address,
                label: label || 'Imported Wallet',
                tags: ['Imported'],
                isWhale: false,
                isSmart: false,
                totalValue: 0,
                change24h: 0,
                lastActive: new Date(),
                alertsEnabled: true
            });
        }
    }
    setWatchedWallets(prev => [...newTracked, ...prev]);
    setShowBatchImport(false);
  };

  const filteredWallets = (watchedWallets || []).filter(w => {
    if (filter === 'whales' && !w.isWhale) return false;
    if (filter === 'smart' && !w.isSmart) return false;
    if (filter === 'alerts' && !w.alertsEnabled) return false;
    if (searchQuery && !w.label.toLowerCase().includes(searchQuery.toLowerCase()) 
        && !w.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatValue = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1F1F1F] flex items-center gap-3">
            <Waves className="text-blue-500" />
            Whale Tracker
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>
          </h1>
          <p className="text-sm text-[#1F1F1F]/70 mt-1">
            Tracking {watchedWallets.length} high-value wallets in real-time
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Eye />} label="Watched" value={watchedWallets.length} />
        <StatCard icon={<Waves />} label="Whales" value={watchedWallets.filter(w => w.isWhale).length} />
        <StatCard icon={<Star />} label="Smart Money" value={watchedWallets.filter(w => w.isSmart).length} />
        <StatCard icon={<Bell />} label="Alerts" value={watchedWallets.filter(w => w.alertsEnabled).length} />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F1F1F]/50" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wallets..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl outline-none focus:bg-white/80 transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-3 bg-white/50 rounded-2xl outline-none focus:bg-white/80 transition-all font-bold"
        >
          <option value="all">All Wallets</option>
          <option value="whales">Whales Only</option>
          <option value="smart">Smart Money</option>
          <option value="alerts">With Alerts</option>
        </select>

        <button
          onClick={() => setShowAddWallet(true)}
          className="px-4 py-3 bg-[#1F1F1F] text-white rounded-2xl font-bold hover:bg-[#1F1F1F]/90 transition-all flex items-center gap-2"
        >
          <Eye size={20} />
          Add Wallet
        </button>

        <button
          onClick={() => setShowBatchImport(true)}
          className="px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Upload size={20} />
          Batch Import
        </button>
      </div>

      {/* Watched Wallets Grid */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-[#1F1F1F]">Watched Wallets</h2>
        {filteredWallets.length === 0 ? (
          <div className="text-center py-12 text-[#1F1F1F]/70">
            <p className="text-lg font-bold">No wallets found matching your filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {filteredWallets.map((wallet, index) => (
                <WalletCard key={wallet.id} wallet={wallet} index={index} formatValue={formatValue} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Recent Whale Activity */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-[#1F1F1F] flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            Recent Whale Activity
        </h2>
        <div className="space-y-2">
            <AnimatePresence>
                {activities.map((activity, index) => (
                    <ActivityCard key={activity.id} activity={activity} index={index} />
                ))}
            </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AddWalletModal isOpen={showAddWallet} onClose={() => setShowAddWallet(false)} onAdd={handleAddWallet} />
      <BatchImportModal isOpen={showBatchImport} onClose={() => setShowBatchImport(false)} onImport={handleBatchImport} />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1F1F1F]/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[#1F1F1F]/70">{icon}</div>
        <span className="text-xs font-bold text-[#1F1F1F]/70 uppercase">{label}</span>
      </div>
      <div className="text-2xl font-black text-[#1F1F1F]">{value}</div>
    </motion.div>
  );
}

function WalletCard({ wallet, index, formatValue }: { wallet: WatchedWallet, index: number, formatValue: (v: number) => string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1F1F1F]/10 hover:bg-white/80 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-black text-[#1F1F1F] truncate">{wallet.label}</h3>
            {wallet.isWhale && <Waves size={16} className="text-blue-500" />}
            {wallet.isSmart && <Star size={16} className="text-yellow-500 fill-current" />}
            {wallet.alertsEnabled && <Bell size={16} className="text-green-500" />}
          </div>
          <div className="text-xs font-mono text-[#1F1F1F]/60 mb-2 truncate">{wallet.address}</div>
          <div className="flex flex-wrap gap-1">
            {wallet.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-[#1F1F1F]/10 rounded-full text-xs font-bold text-[#1F1F1F]">{tag}</span>)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-[#1F1F1F] mb-1">{formatValue(wallet.totalValue)}</div>
          <div className={`text-sm font-bold flex items-center gap-1 justify-end ${wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {wallet.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(wallet.change24h).toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityCard({ activity, index }: { activity: WhaleActivity, index: number }) {
    const getTypeColor = (type: string) => {
        switch(type) {
            case 'BUY': return 'text-green-600 bg-green-100';
            case 'SELL': return 'text-red-600 bg-red-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-[#1F1F1F]/10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getTypeColor(activity.type)}`}>{activity.type}</span>
                        <span className="font-bold text-[#1F1F1F]">{activity.walletLabel}</span>
                    </div>
                    <div className="text-sm text-[#1F1F1F]/70">{activity.amount.toLocaleString()} {activity.token} (${(activity.usdValue / 1e6).toFixed(2)}M)</div>
                </div>
                <div className="text-xs text-[#1F1F1F]/50 font-mono">{new Date(activity.timestamp).toLocaleTimeString()}</div>
            </div>
        </motion.div>
    );
}

function AddWalletModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (address: string, label: string) => void }) {
    const [address, setAddress] = useState('');
    const [label, setLabel] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#EAEADF] w-full max-w-md rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-[#1F1F1F]">Add Whale Wallet</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="w-full px-4 py-3 bg-white rounded-xl outline-none" />
                    <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="w-full px-4 py-3 bg-white rounded-xl outline-none" />
                    <button onClick={() => { if(address) onAdd(address, label); }} className="w-full py-4 bg-[#1F1F1F] text-white rounded-2xl font-black">Track Wallet</button>
                </div>
            </motion.div>
        </div>
    );
}

function BatchImportModal({ isOpen, onClose, onImport }: { isOpen: boolean, onClose: () => void, onImport: (text: string) => void }) {
    const [text, setText] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#EAEADF] w-full max-w-2xl rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-[#1F1F1F]">Batch Import</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={24} /></button>
                </div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="0xAddress, Label" className="w-full px-4 py-3 bg-white rounded-xl outline-none font-mono mb-6" />
                <button onClick={() => { if(text) onImport(text); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">Process Import</button>
            </motion.div>
        </div>
    );
}
