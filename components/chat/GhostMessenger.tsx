'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Lock, Send, X, Terminal, Copy, Shield, Wifi, Minimize2, Loader2, User } from 'lucide-react';
import { useClient, useCanMessage, useStartConversation, useStreamMessages, useMessages } from '@xmtp/react-sdk';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from './XMTPProviderWrapper';
import { toast } from 'sonner';

export function GhostMessenger() {
    const [isOpen, setIsOpen] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [peerAddress, setPeerAddress] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [conversation, setConversation] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    // XMTP Hooks
    const { client, initialize } = useClient();
    const { canMessage } = useCanMessage();
    const { startConversation } = useStartConversation();
    const { messages, isLoading: isLoadingMessages } = useMessages(conversation);
    useStreamMessages(conversation); // Stream new messages

    const { data: walletClient } = useWalletClient();

    // Scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize Client
    const handleConnect = async () => {
        if (!walletClient) {
            toast.error("Connect Wallet first");
            return;
        }

        try {
            setIsInitializing(true);
            const signer = walletClientToSigner(walletClient);
            const xmtp = await initialize({ signer });
            setIsConnected(true);
            toast.success("Secure Uplink Established");
        } catch (e) {
            console.error(e);
            toast.error("Failed to initialize secure channel");
        } finally {
            setIsInitializing(false);
        }
    };

    // Start Chat
    const handleStartChat = async () => {
        if (!client || !peerAddress) return;

        // Validate address format
        if (!peerAddress.startsWith('0x') || peerAddress.length !== 42) {
            toast.error("Invalid Etherum address");
            return;
        }

        try {
            const canMsg = await canMessage(peerAddress);
            if (!canMsg) {
                toast.error("Recipient has not activated XMTP yet");
                // We could let them try anyway, but warning is good
            }

            const conv = await startConversation(peerAddress, "Attempting secure connection...");
            setConversation(conv);
            toast.success(`Connected to ${peerAddress.slice(0, 6)}...`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to start conversation");
        }
    };

    // Send Message
    const handleSend = async () => {
        if (!messageInput || !conversation) return;
        try {
            await conversation.send(messageInput);
            setMessageInput('');
        } catch (e) {
            console.error(e);
            toast.error("Transmission failed");
        }
    };

    return (
        <>
            {/* --- FLOATING TOGGLE --- */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-[#0D0D12] text-indigo-400 hover:text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}

                {/* Connection Status Dot */}
                {client && !isOpen && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0D0D12] animate-pulse" />
                )}
            </motion.button>

            {/* --- CHAT TERMINAL --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-[#0D0D12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono"
                    >
                        {/* TERMINAL HEADER */}
                        <div className="h-10 border-b border-white/10 bg-black/40 flex items-center justify-between px-4 select-none">
                            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold tracking-widest">
                                <Terminal size={12} />
                                GHOST_LINK // {client ? 'SECURE' : 'OFFLINE'}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex-1 overflow-hidden relative flex flex-col">

                            {/* STATE 1: NOT CONNECTED */}
                            {!client && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <Lock size={32} className="text-indigo-400" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Encrypted Uplink</h3>
                                    <p className="text-xs text-zinc-500">
                                        Connect your wallet to establish an end-to-end encrypted messaging channel via XMTP.
                                    </p>
                                    <button
                                        onClick={handleConnect}
                                        disabled={isInitializing}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {isInitializing && <Loader2 size={12} className="animate-spin" />}
                                        {isInitializing ? 'INITIALIZING...' : 'INITIALIZE UPLINK'}
                                    </button>
                                </div>
                            )}

                            {/* STATE 2: CONNECTED BUT NO CHAT SELECTED */}
                            {client && !conversation && (
                                <div className="flex-1 p-4 flex flex-col">
                                    <div className="text-xs text-zinc-500 mb-4 uppercase tracking-wider">Start Transmission</div>

                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="0x..."
                                            value={peerAddress}
                                            onChange={(e) => setPeerAddress(e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                        />
                                        <button
                                            onClick={handleStartChat}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {/* RECENT CONTACTS MOCK */}
                                        <div className="text-[10px] text-zinc-600 mb-2">DETECTED SIGNALS</div>
                                        <div className="space-y-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer opacity-50">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                                                    <div className="flex-1">
                                                        <div className="h-2 w-20 bg-zinc-800 rounded mb-1" />
                                                        <div className="h-2 w-12 bg-zinc-800 rounded" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-center text-[10px] text-zinc-600 mt-4">History module syncing...</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STATE 3: ACTIVE CHAT */}
                            {client && conversation && (
                                <div className="flex-1 flex flex-col h-full">
                                    {/* Chat Header */}
                                    <div className="bg-white/5 p-2 flex items-center justify-between text-xs border-b border-white/5">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <User size={12} />
                                            <span>{conversation.peerAddress.substring(0, 6)}...</span>
                                        </div>
                                        <button onClick={() => setConversation(null)} className="text-zinc-500 hover:text-white">
                                            <X size={12} />
                                        </button>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                        {isLoadingMessages && (
                                            <div className="flex justify-center"><Loader2 size={16} className="animate-spin text-zinc-600" /></div>
                                        )}
                                        {messages?.map((msg: any) => {
                                            const isMe = msg.senderAddress === client.address;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-xl p-3 text-xs ${isMe
                                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                                            : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                                                        }`}>
                                                        {msg.content}
                                                        <div className={`text-[9px] mt-1 ${isMe ? 'text-indigo-200' : 'text-zinc-500'} text-right`}>
                                                            {msg.sent.toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-3 border-t border-white/10 bg-black/20">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Encrypting message..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                            <button
                                                onClick={handleSend}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white transition-colors"
                                            >
                                                <Send size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* FOOTER DECORATION */}
                        <div className="h-6 bg-black/60 border-t border-white/10 flex items-center px-4 justify-between text-[10px] text-zinc-600">
                            <span className="flex items-center gap-1"><Shield size={8} /> E2EE ACTIVE</span>
                            <span className="flex items-center gap-1"><Wifi size={8} /> XMTP NET</span>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
