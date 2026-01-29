import { useState } from 'react';
import { toast } from 'sonner';

export type ZapStep = 'IDLE' | 'UNLOCKING' | 'SWAPPING' | 'STAKING' | 'COMPLETED';

export function useZap() {
    const [status, setStatus] = useState<ZapStep>('IDLE');
    const [txHash, setTxHash] = useState<string | null>(null);

    const zapIn = async (poolName: string, amount: string) => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Invalid amount');
            return;
        }

        try {
            // Step 1: Unlock
            setStatus('UNLOCKING');
            await new Promise(r => setTimeout(r, 1500));

            // Step 2: Swap
            setStatus('SWAPPING');
            await new Promise(r => setTimeout(r, 1500));

            // Step 3: Stake
            setStatus('STAKING');
            await new Promise(r => setTimeout(r, 1500));

            // Done
            setStatus('COMPLETED');
            setTxHash('0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)); // Mock Hash
            toast.success(`Successfully Zapped into ${poolName}!`);

            // Reset after delay
            setTimeout(() => {
                setStatus('IDLE');
                setTxHash(null);
            }, 5000);

        } catch (error) {
            console.error(error);
            setStatus('IDLE');
            toast.error('Zap Failed');
        }
    };

    return { status, zapIn, txHash };
}
