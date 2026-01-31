"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpDown, Eye } from 'lucide-react';
import type { WatchedWallet } from './WhaleTracker';

interface WalletComparisonProps {
  wallets: WatchedWallet[];
  isPremium: boolean;
}

export default function WalletComparison({ wallets, isPremium }: WalletComparisonProps) {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [metric, setMetric] = useState<'value' | 'change' | 'activity'>('value');

  const toggleWallet = (id: string) => {
    if (selectedWallets.includes(id)) {
      setSelectedWallets(selectedWallets.filter(w => w !== id));
    } else {
      if (!isPremium && selectedWallets.length >= 2) {
        alert('Upgrade to Pro to compare unlimited wallets');
        return;
      }
      setSelectedWallets([...selectedWallets, id]);
    }
  };

  const compareData = selectedWallets.map(id => {
    const wallet = wallets.find(w => w.id === id);
    return wallet;
  }).filter(Boolean) as WatchedWallet[];

  const formatValue = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#1F1F1F] flex items-center gap-2">
          <BarChart3 className="text-purple-500" />
          Wallet Comparison
        </h2>
        <div className="text-sm text-[#1F1F1F]/70">
          {!isPremium && `Limited to 2 wallets`}
        </div>
      </div>

      {/* Wallet Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {wallets.map(wallet => (
          <button
            key={wallet.id}
            onClick={() => toggleWallet(wallet.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedWallets.includes(wallet.id)
                ? 'border-purple-500 bg-purple-50'
                : 'border-[#1F1F1F]/10 bg-white/50 hover:bg-white/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#1F1F1F] truncate">{wallet.label}</span>
              {selectedWallets.includes(wallet.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </div>
            <div className="text-sm text-[#1F1F1F]/60 font-mono truncate">
              {wallet.address.slice(0, 12)}...
            </div>
          </button>
        ))}
      </div>

      {/* Comparison Results */}
      {compareData.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Metric Selector */}
          <div className="flex gap-2 bg-white/50 p-2 rounded-xl">
            <button
              onClick={() => setMetric('value')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                metric === 'value' ? 'bg-[#1F1F1F] text-white' : 'text-[#1F1F1F]/70'
              }`}
            >
              Total Value
            </button>
            <button
              onClick={() => setMetric('change')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                metric === 'change' ? 'bg-[#1F1F1F] text-white' : 'text-[#1F1F1F]/70'
              }`}
            >
              24h Change
            </button>
            <button
              onClick={() => setMetric('activity')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                metric === 'activity' ? 'bg-[#1F1F1F] text-white' : 'text-[#1F1F1F]/70'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1F1F1F]/10">
            <div className="space-y-4">
              {compareData.map((wallet, index) => {
                const maxValue = Math.max(...compareData.map(w => w.totalValue));
                const percentage = metric === 'value' 
                  ? (wallet.totalValue / maxValue) * 100
                  : metric === 'change'
                  ? Math.min(Math.abs(wallet.change24h) * 10, 100)
                  : (wallet.totalValue > 0 ? Math.min((wallet.totalValue / 1e6) * 10, 100) : 0); 

                return (
                  <div key={wallet.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#1F1F1F]">{wallet.label}</span>
                      <span className="text-sm font-bold text-[#1F1F1F]">
                        {metric === 'value' && formatValue(wallet.totalValue)}
                        {metric === 'change' && (
                          <span className={wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h.toFixed(2)}%
                          </span>
                        )}
                        {metric === 'activity' && `${percentage.toFixed(0)} txs`}
                      </span>
                    </div>
                    <div className="relative h-8 bg-[#1F1F1F]/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          index === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#1F1F1F]/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1F1F1F]/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#1F1F1F] uppercase">Wallet</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-[#1F1F1F] uppercase">Value</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-[#1F1F1F] uppercase">24h Change</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#1F1F1F] uppercase">Tags</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-[#1F1F1F] uppercase">Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {compareData.map((wallet, index) => (
                    <tr key={wallet.id} className={index % 2 === 0 ? 'bg-white/30' : ''}>
                      <td className="px-4 py-3 font-bold text-[#1F1F1F]">{wallet.label}</td>
                      <td className="px-4 py-3 text-right font-bold text-[#1F1F1F]">{formatValue(wallet.totalValue)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold flex items-center gap-1 justify-end ${wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {wallet.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {Math.abs(wallet.change24h).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {wallet.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-[#1F1F1F]/10 rounded-full text-xs font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {wallet.alertsEnabled ? (
                          <span className="text-green-600">●</span>
                        ) : (
                          <span className="text-gray-400">○</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {compareData.length < 2 && (
        <div className="text-center py-12 text-[#1F1F1F]/70">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-bold mb-2">Select at least 2 wallets to compare</p>
          <p className="text-sm">Click on the wallets above to add them to the comparison</p>
        </div>
      )}
    </div>
  );
}
