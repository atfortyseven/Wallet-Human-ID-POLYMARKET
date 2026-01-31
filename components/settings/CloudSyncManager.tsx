"use client";

import React, { useState } from 'react';
import { Cloud, Database, RefreshCw, Check, AlertCircle, Loader2, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

export function CloudSyncManager() {
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [isAppleConnected, setIsAppleConnected] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [lastBackup, setLastBackup] = useState<string | null>(null);

    const handleGoogleConnect = async () => {
        // Simulation of OAuth flow
        toast.loading("Connecting to Google Drive...");
        setTimeout(() => {
            toast.dismiss();
            setIsGoogleConnected(true);
            toast.success("Connected to Google Drive");
        }, 1500);
    };

    const handleAppleConnect = async () => {
        // Simulation of CloudKit Auth
        toast.loading("Connecting to iCloud...");
        setTimeout(() => {
            toast.dismiss();
            setIsAppleConnected(true);
            toast.success("Connected to iCloud");
        }, 1500);
    };

    const handleBackup = async () => {
        if (!isGoogleConnected && !isAppleConnected) {
            toast.error("Connect a cloud service first");
            return;
        }

        setIsBackingUp(true);
        try {
            // Call API to generate backup payload
            const res = await fetch('/api/user/backup', { method: 'POST' });
            if (!res.ok) throw new Error("Backup failed");
            
            const data = await res.json();
            
            // Simulation of upload delay
            await new Promise(r => setTimeout(r, 2000));
            
            setLastBackup(new Date().toLocaleString());
            toast.success("Backup successful", { description: `Synced ${data.size} items` });
        } catch (e) {
            toast.error("Backup failed");
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Status */}
            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-[2rem] border border-blue-500/20 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Cloud className="w-40 h-40 text-blue-500" />
                </div>
                
                <h3 className="text-xl font-bold text-[#1F1F1F] flex items-center gap-2 mb-2 relative z-10">
                    <Database className="text-blue-600" size={24} />
                    Cloud Synchronization
                </h3>
                <p className="text-[#1F1F1F]/60 max-w-lg relative z-10">
                    Keep your settings, contacts, and preferences safe. Sync encrypted backups to your personal cloud storage.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 relative z-10">
                    <button
                        onClick={handleBackup}
                        disabled={isBackingUp || (!isGoogleConnected && !isAppleConnected)}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${(!isGoogleConnected && !isAppleConnected)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'}
                        `}
                    >
                        {isBackingUp ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                        {isBackingUp ? "Syncing..." : "Sync Now"}
                    </button>
                    
                    {lastBackup && (
                        <div className="flex items-center gap-2 text-sm text-[#1F1F1F]/60 px-4 bg-white/50 rounded-xl border border-white/40">
                            <Check size={16} className="text-emerald-500" />
                            Last synced: {lastBackup}
                        </div>
                    )}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Drive */}
                <div className="p-6 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[2rem] hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-8 h-8" />
                        </div>
                        {isGoogleConnected ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Check size={12} /> Connected
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                                Not Connected
                            </span>
                        )}
                    </div>
                    <h4 className="font-bold text-[#1F1F1F] text-lg">Google Drive</h4>
                    <p className="text-sm text-[#1F1F1F]/50 mt-1 mb-6">Backup to your private App Data folder. Hidden from main view.</p>
                    
                    <button 
                        onClick={handleGoogleConnect}
                        disabled={isGoogleConnected}
                        className={`w-full py-3 rounded-xl font-bold border transition-all
                            ${isGoogleConnected 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-white border-gray-200 text-[#1F1F1F] hover:bg-gray-50'}
                        `}
                    >
                        {isGoogleConnected ? "Disconnect" : "Connect Drive"}
                    </button>
                </div>

                {/* iCloud */}
                <div className="p-6 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[2rem] hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg" alt="iCloud" className="w-8 h-8" />
                        </div>
                        {isAppleConnected ? (
                             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Check size={12} /> Connected
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                                Not Connected
                            </span>
                        )}
                    </div>
                    <h4 className="font-bold text-[#1F1F1F] text-lg">iCloud Drive</h4>
                    <p className="text-sm text-[#1F1F1F]/50 mt-1 mb-6">Sync across all your Apple devices using CloudKit.</p>
                    
                    <button 
                         onClick={handleAppleConnect}
                         disabled={isAppleConnected}
                        className={`w-full py-3 rounded-xl font-bold border transition-all
                            ${isAppleConnected 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-white border-gray-200 text-[#1F1F1F] hover:bg-gray-50'}
                        `}
                    >
                         {isAppleConnected ? "Disconnect" : "Connect iCloud"}
                    </button>
                </div>

                 {/* Local Backup */}
                 <div className="md:col-span-2 p-6 bg-[#1F1F1F]/5 border border-[#1F1F1F]/10 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#1F1F1F] text-white rounded-xl">
                            <HardDrive size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1F1F1F]">Local Export</h4>
                            <p className="text-xs text-[#1F1F1F]/50">Download a .json file of your data.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-[#1F1F1F] text-sm font-bold rounded-lg shadow-sm border hover:bg-gray-50 transition-colors">
                        Download
                    </button>
                </div>

            </div>
        </div>
    );
}
