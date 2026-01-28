'use client';

import React, { useEffect, useState } from 'react';
import { Fuel } from 'lucide-react';

export const BaseGasWidget = () => {
    const [gasPrice, setGasPrice] = useState<string>('---');
    const [status, setStatus] = useState<'LOW' | 'HIGH'>('LOW');

    useEffect(() => {
        const fetchGas = async () => {
            try {
                // Fetch from Base Mainnet RPC
                const res = await fetch('https://mainnet.base.org', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_gasPrice',
                        params: [],
                        id: 1
                    })
                });
                const data = await res.json();
                const wei = parseInt(data.result, 16);
                const gwei = (wei / 1e9).toFixed(2);

                setGasPrice(gwei);
                setStatus(parseFloat(gwei) < 0.1 ? 'LOW' : 'HIGH'); // Base is usually cheap
            } catch (e) {
                console.error("Gas Sync Failed", e);
            }
        };

        fetchGas();
        const interval = setInterval(fetchGas, 10000); // 10s poll
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 glass px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-[10px] font-mono text-[#888899] hover:border-[#00f2ea] transition-colors cursor-help group">
            <Fuel size={12} className={status === 'LOW' ? 'text-[#00ff9d]' : 'text-yellow-500'} />
            <span>BASE: {gasPrice} GWEI</span>
            <span className="hidden group-hover:inline text-[#00f2ea]"> // OPTIMAL</span>
        </div>
    );
};
