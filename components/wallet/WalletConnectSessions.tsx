"use client";

import React from 'react';
import { useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';
import { Shield, Link, Network, Cpu, LogOut, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function WalletConnectSessions() {
    const { isConnected, address, caipAddress } = useAppKitAccount();
    const { caipNetwork } = useAppKitNetwork();
    const { disconnect } = useDisconnect();

    const handleDisconnect = async () => {
        try {
            await disconnect();
            toast.success("Wallet disconnected");
        } catch (e) {
            toast.error("Failed to disconnect");
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/30 backdrop-blur-md rounded-[3rem] border border-dashed border-[#1F1F1F]/20">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl text-[#1F1F1F]/40">
                    <Link size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1F1F1F]/80 mb-2">No Active Session</h3>
                <p className="text-[#1F1F1F]/40 font-medium">Connect your wallet to see session details.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-[#1F1F1F] flex items-center gap-2">
                        <Activity className="text-emerald-500" />
                        Active Connection
                    </h3>
                    <p className="text-sm text-[#1F1F1F]/50">Monitoring real-time session parameters.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 animate-pulse">
                    LIVE
                </span>
            </div>

            <div className="grid gap-6">
                {/* Network Status */}
                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Network size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1F1F1F]/40 uppercase">Network</p>
                            <p className="text-[#1F1F1F] font-bold">{caipNetwork?.name || 'Unknown Network'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-xs font-bold text-[#1F1F1F]/40 uppercase">Chain ID</p>
                         <p className="font-mono text-sm text-[#1F1F1F]">{caipNetwork?.id || '---'}</p>
                    </div>
                </div>

                {/* Session Details */}
                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1F1F1F]/40 uppercase">Protocol</p>
                            <p className="text-[#1F1F1F] font-bold">WalletConnect v2</p>
                        </div>
                    </div>
                     <div className="text-right">
                         <p className="text-xs font-bold text-[#1F1F1F]/40 uppercase">Encryption</p>
                         <p className="font-mono text-sm text-[#1F1F1F] flex items-center gap-1 justify-end">
                            <Shield size={12} className="text-emerald-500" /> End-to-End
                         </p>
                    </div>
                </div>

                 {/* Address Info */}
                 <div className="p-6 bg-[#1F1F1F] rounded-2xl shadow-xl text-white">
                    <p className="text-xs font-bold text-white/40 uppercase mb-2">Connected Account</p>
                    <p className="font-mono text-lg md:text-xl break-all">{address}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-white/40">{caipAddress || 'CAIP-10 Standard'}</span>
                        <div className="flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <span className="text-xs font-bold text-emerald-400">Secure</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleDisconnect}
                    className="w-full py-4 mt-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <LogOut size={18} />
                    Disconnect Session
                </button>
            </div>
        </div>
    );
}
