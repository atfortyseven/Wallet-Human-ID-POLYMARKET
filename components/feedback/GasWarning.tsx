"use client";

import { useBalance, useAccount } from "wagmi";
import { AlertTriangle } from "lucide-react";

export default function GasWarning() {
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });

    // 0.01 MATIC threshold
    const LOW_GAS_THRESHOLD = 0.01;

    if (!balance) return null;

    const isLowGas = parseFloat(balance.formatted) < LOW_GAS_THRESHOLD;

    if (!isLowGas) return null;

    return (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium animate-pulse">
            <AlertTriangle size={16} />
            <span>⚠️ No tienes suficiente MATIC para pagar el gas.</span>
        </div>
    );
}
