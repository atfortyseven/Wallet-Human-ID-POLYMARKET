
import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptic() {
    
    const trigger = useCallback((pattern: HapticPattern) => {
        if (typeof window === 'undefined' || !window.navigator?.vibrate) return;

        switch (pattern) {
            case 'light':
                window.navigator.vibrate(5); // Very subtle "Taptic" click
                break;
            case 'medium':
                window.navigator.vibrate(15);
                break;
            case 'heavy':
                window.navigator.vibrate(40);
                break;
            case 'success':
                window.navigator.vibrate([10, 30, 20]);
                break;
            case 'warning':
                window.navigator.vibrate([30, 50, 30]);
                break;
            case 'error':
                 window.navigator.vibrate([50, 100, 50, 100]);
                 break;
            default:
                break;
        }
    }, []);

    return { trigger };
}
