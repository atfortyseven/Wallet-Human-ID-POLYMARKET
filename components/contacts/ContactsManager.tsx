"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Plus, Trash2, Search, User, Wallet, Mail, Star, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Contact {
    id: string;
    name: string;
    email?: string;
    walletAddress?: string;
    notes?: string;
    favorite: boolean;
    tags: string[];
}

export function ContactsManager() {
    const { data, error, isLoading } = useSWR('/api/user/contacts', fetcher);
    const contacts = data?.contacts as Contact[] || [];

    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newWallet, setNewWallet] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/user/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail,
                    walletAddress: newWallet,
                    tags: [],
                    favorite: false
                })
            });
            
            if (!res.ok) throw new Error("Failed to create contact");
            
            toast.success("Contact added successfully");
            setNewName('');
            setNewEmail('');
            setNewWallet('');
            setIsAdding(false);
            mutate('/api/user/contacts');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await fetch(`/api/user/contacts?id=${id}`, { method: 'DELETE' });
            toast.success("Contact deleted");
            mutate('/api/user/contacts');
        } catch (e) {
            toast.error("Failed to delete contact");
        }
    };

    return (
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-[2rem] min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-[#1F1F1F]">Address Book</h3>
                    <p className="text-sm text-[#1F1F1F]/50">Manage your trusted contacts and wallet addresses.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-[#1F1F1F] text-white px-5 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={18} /> Add Contact
                </button>
            </div>

            {/* Content */}
            {isAdding ? (
                // ADD FORM
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-sm border border-[#1F1F1F]/5">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-lg">New Contact</h4>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full text-zinc-500">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddContact} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-[#1F1F1F]/60 uppercase tracking-widest mb-1 block">Name</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Alice Wonderland"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#1F1F1F]/60 uppercase tracking-widest mb-1 block">Wallet Address (Optional)</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                                    value={newWallet}
                                    onChange={e => setNewWallet(e.target.value)}
                                    placeholder="0x..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#1F1F1F]/60 uppercase tracking-widest mb-1 block">Email (Optional)</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    placeholder="alice@example.com"
                                    type="email"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 mt-6"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                                Save Contact
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                // LIST VIEW
                <>
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            className="w-full bg-white/60 border border-white/40 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#1F1F1F]/10 transition-all font-medium"
                            placeholder="Search name, address or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {isLoading ? (
                            <div className="text-center py-12 text-[#1F1F1F]/40 animate-pulse">Loading contacts...</div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="text-center py-12 text-[#1F1F1F]/40 flex flex-col items-center">
                                <User size={48} className="mb-4 opacity-20" />
                                <p>No contacts found.</p>
                            </div>
                        ) : (
                            filteredContacts.map(contact => (
                                <div key={contact.id} className="group bg-white/80 border border-white/50 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1F1F1F] flex items-center gap-2">
                                                {contact.name}
                                                {contact.favorite && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
                                            </h4>
                                            <div className="flex flex-col gap-1 mt-1">
                                                {contact.walletAddress && (
                                                    <span className="text-xs text-[#1F1F1F]/50 font-mono flex items-center gap-1">
                                                        <Wallet size={10} /> {contact.walletAddress.slice(0,6)}...{contact.walletAddress.slice(-4)}
                                                    </span>
                                                )}
                                                {contact.email && (
                                                    <span className="text-xs text-[#1F1F1F]/50 flex items-center gap-1">
                                                        <Mail size={10} /> {contact.email}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(contact.id)}
                                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Contact"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
