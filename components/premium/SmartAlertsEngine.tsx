"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, Zap, TrendingUp, TrendingDown, Copy, CheckCircle, X, Plus, Filter, Send } from 'lucide-react';

interface SmartAlert {
  id: string;
  type: 'whale_move' | 'smart_buy' | 'smart_sell' | 'profit_target' | 'risk_alert' | 'copy_signal';
  walletLabel: string;
  walletAddress: string;
  title: string;
  description: string;
  action?: {
    type: 'BUY' | 'SELL' | 'TRANSFER';
    token: string;
    amount: number;
    usdValue: number;
  };
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  copyable?: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    type: string;
    value: any;
  }[];
  actions: {
    telegram?: boolean;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export default function SmartAlertsEngine({ isPremium }: { isPremium: boolean }) {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showCreateRule, setShowCreateRule] = useState(false);

  useEffect(() => {
    // Simulate alerts in real-time
    const mockAlerts: SmartAlert[] = [
      {
        id: '1',
        type: 'whale_move',
        walletLabel: 'Binance Hot Wallet',
        walletAddress: '0x28C6c06298d514Db089934071355E5743bf21d60',
        title: '🐋 Massive ETH Transfer',
        description: 'Transferred 5,000 ETH ($12.5M) to unknown wallet',
        action: {
          type: 'TRANSFER',
          token: 'ETH',
          amount: 5000,
          usdValue: 12500000,
        },
        timestamp: new Date(Date.now() - 300000),
        priority: 'critical',
        read: false,
      },
      {
        id: '2',
        type: 'smart_buy',
        walletLabel: 'Vitalik Buterin',
        walletAddress: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
        title: '⚡ Smart Money Accumulation',
        description: 'Accumulated 50K AAVE tokens - Pattern suggests bullish signal',
        action: {
          type: 'BUY',
          token: 'AAVE',
          amount: 50000,
          usdValue: 4250000,
        },
        timestamp: new Date(Date.now() - 600000),
        priority: 'high',
        read: false,
        copyable: true,
      },
      {
        id: '3',
        type: 'profit_target',
        walletLabel: 'DeFi Whale #47',
        walletAddress: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
        title: '🎯 Profit Target Reached',
        description: 'UNI position up 95% - Consider taking profits',
        timestamp: new Date(Date.now() - 900000),
        priority: 'medium',
        read: true,
      }
    ];

    const mockRules: AlertRule[] = [
      {
        id: '1',
        name: 'Whale Movements > $1M',
        enabled: true,
        conditions: [
          { type: 'transaction_value', value: 1000000 },
          { type: 'wallet_label', value: 'whale' },
        ],
        actions: {
          telegram: true,
          push: true,
          email: false,
          sms: false,
        },
      }
    ];

    if (isPremium) {
      setAlerts(mockAlerts);
      setAlertRules(mockRules);
    } else {
      setAlerts(mockAlerts.slice(0, 2));
      setAlertRules(mockRules.slice(0, 1));
    }
  }, [isPremium]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'critical') return alert.priority === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleCopyTrade = (alert: SmartAlert) => {
    if (!alert.copyable || !alert.action) return;
    window.alert(`🎯 Copy Trade Executed!\n\n${alert.action.type} ${alert.action.amount.toLocaleString()} ${alert.action.token}\nValue: $${alert.action.usdValue.toLocaleString()}`);
  };

  const toggleRule = (ruleId: string) => {
    setAlertRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleCreateRule = (name: string, channels: any) => {
    const newRule: AlertRule = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      enabled: true,
      conditions: [{ type: 'custom', value: 'all' }],
      actions: channels,
    };
    setAlertRules(prev => [...prev, newRule]);
    setShowCreateRule(false);
  };

  if (!isPremium) {
    return (
      <div className="p-12 text-center bg-white/30 rounded-2xl border-2 border-dashed border-[#1F1F1F]/20">
        <BellRing size={64} className="mx-auto mb-4 text-[#1F1F1F]/30" />
        <h3 className="text-2xl font-black text-[#1F1F1F] mb-2">Smart Alerts Engine</h3>
        <p className="text-[#1F1F1F]/70 mb-6">
          Get instant notifications when whales make moves. Never miss an opportunity.
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Unlock Alerts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1F1F1F] flex items-center gap-2">
            <BellRing className="text-orange-500" />
            Smart Alerts
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-sm text-[#1F1F1F]/70 mt-1">
            Real-time notifications powered by AI
          </p>
        </div>

        <button
          onClick={() => setShowCreateRule(true)}
          className="px-4 py-2 bg-[#1F1F1F] text-white rounded-xl font-bold hover:bg-[#1F1F1F]/90 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Rule
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-white/50 p-2 rounded-xl">
        {(['all', 'unread', 'critical'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all capitalize ${
              filter === f ? 'bg-[#1F1F1F] text-white' : 'text-[#1F1F1F]/70 hover:bg-white/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              index={index}
              onCopyTrade={handleCopyTrade}
              onMarkRead={() => {
                setAlerts(alerts.map(a =>
                  a.id === alert.id ? { ...a, read: true } : a
                ));
              }}
            />
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-[#1F1F1F]/70">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">No alerts yet</p>
            <p className="text-sm">You'll be notified when whales make moves</p>
          </div>
        )}
      </div>

      {/* Alert Rules */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1F1F1F]/10">
        <h3 className="text-lg font-black text-[#1F1F1F] mb-4 flex items-center gap-2">
          <Filter className="text-purple-600" />
          Alert Rules
        </h3>

        <div className="space-y-3">
          {alertRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
            >
              <div className="flex-1">
                <div className="font-bold text-[#1F1F1F] mb-1">{rule.name}</div>
                <div className="flex gap-2">
                  {rule.actions.telegram && <ActionBadge icon="📱" label="Telegram" />}
                  {rule.actions.push && <ActionBadge icon="🔔" label="Push" />}
                  {rule.actions.email && <ActionBadge icon="📧" label="Email" />}
                  {rule.actions.sms && <ActionBadge icon="💬" label="SMS" />}
                </div>
              </div>

              <button
                onClick={() => toggleRule(rule.id)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  rule.enabled
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {rule.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <CreateRuleModal 
        isOpen={showCreateRule} 
        onClose={() => setShowCreateRule(false)} 
        onCreate={handleCreateRule} 
      />
    </div>
  );
}

function CreateRuleModal({ isOpen, onClose, onCreate }: { isOpen: boolean, onClose: () => void, onCreate: (name: string, actions: any) => void }) {
  const [name, setName] = useState('');
  const [actions, setActions] = useState({ telegram: true, push: true, email: false, sms: false });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#EAEADF] w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#1F1F1F]">Create Alert Rule</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={24} /></button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-[#1F1F1F]/60 mb-2">Rule Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BTC Huge Move" 
              className="w-full px-4 py-3 bg-white rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#1F1F1F]/60 mb-4">Notification Channels</label>
            <div className="grid grid-cols-2 gap-3">
              {(['telegram', 'push', 'email', 'sms'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setActions(prev => ({ ...prev, [ch]: !prev[ch] }))}
                  className={`p-3 rounded-xl border-2 font-bold transition-all text-sm flex items-center gap-2 ${
                    actions[ch] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-[#1F1F1F]/60 border-black/5'
                  }`}
                >
                  {ch === 'telegram' && '📱'}
                  {ch === 'push' && '🔔'}
                  {ch === 'email' && '📧'}
                  {ch === 'sms' && '💬'}
                  {ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { if(name) onCreate(name, actions); }}
            className="w-full py-4 bg-[#1F1F1F] text-white rounded-2xl font-black text-lg hover:bg-black/90 transition-all"
          >
            Create Rule
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AlertCard({ alert, index, onCopyTrade, onMarkRead }: {
  alert: SmartAlert;
  index: number;
  onCopyTrade: (alert: SmartAlert) => void;
  onMarkRead: () => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border-l-4 ${getPriorityColor(alert.priority)} ${
        alert.read ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold">{alert.title}</span>
            {!alert.read && (
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </div>
          
          <p className="text-sm text-[#1F1F1F]/70 mb-2">{alert.description}</p>

          {alert.action && (
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                alert.action.type === 'BUY' ? 'bg-green-100 text-green-700' :
                alert.action.type === 'SELL' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {alert.action.type}
              </div>
              <span className="font-bold text-[#1F1F1F]">
                {alert.action.amount.toLocaleString()} {alert.action.token}
              </span>
              <span className="text-sm text-[#1F1F1F]/70">
                ${alert.action.usdValue.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-[#1F1F1F]/60 italic">
              {alert.walletLabel} • {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
            {alert.copyable && (
              <button
                onClick={() => onCopyTrade(alert)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Copy size={12} />
                Copy Trade
              </button>
            )}
          </div>
        </div>

        {!alert.read && (
          <button
            onClick={onMarkRead}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <CheckCircle size={20} className="text-green-600" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ActionBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="px-2 py-1 bg-white/50 rounded-lg text-xs font-bold text-[#1F1F1F] flex items-center gap-1">
      {icon} {label}
    </span>
  );
}
