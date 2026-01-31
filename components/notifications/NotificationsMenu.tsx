"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Bell, Check, Trash2, Info } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function NotificationsMenu() {
    const { data: session } = useSWR('/api/auth/session', fetcher); // Check auth first? No, rely on API auth
    const { data, error } = useSWR('/api/user/notifications', fetcher, { refreshInterval: 30000 });
    const [isOpen, setIsOpen] = useState(false);

    const notifications = data?.notifications || [];
    const unreadCount = notifications.filter((n: any) => !n.read).length;

    const markAllRead = async () => {
        try {
            await fetch('/api/user/notifications', {
                method: 'PUT',
                body: JSON.stringify({ read: true })
            });
            mutate('/api/user/notifications'); // Revalidate
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <Bell size={20} className="text-white" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-black animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllRead}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    <Check size={12} /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {!data ? (
                                <div className="p-8 text-center text-zinc-500 animate-pulse">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">
                                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((n: any) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                <Info size={16} className={n.type === 'system' ? 'text-blue-400' : 'text-zinc-400'} />
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium text-white mb-1 ${!n.read ? 'font-bold' : ''}`}>
                                                    {n.title}
                                                </h4>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <span className="text-[10px] text-zinc-600 mt-2 block">
                                                    {new Date(n.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
