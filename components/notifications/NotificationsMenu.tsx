"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Bell, Check, Trash2, Info } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function NotificationsMenu() {
    const { data: session } = useSWR('/api/auth/session', fetcher); 
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
                className="relative p-2 rounded-full hover:bg-black/5 transition-colors group"
            >
                <Bell size={20} className="text-gray-400 group-hover:text-black transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white border border-black/5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full transition-colors"
                                >
                                    <Check size={12} /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto bg-white/50">
                            {!data ? (
                                <div className="p-12 text-center text-gray-400 animate-pulse flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Bell size={20} className="opacity-40" />
                                    </div>
                                    <p>No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((n: any) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'system' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <Info size={14} />
                                            </div>
                                            <div>
                                                <h4 className={`text-sm text-gray-900 mb-1 ${!n.read ? 'font-bold' : 'font-medium'}`}>
                                                    {n.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <span className="text-[10px] text-gray-400 mt-2 block font-medium">
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
