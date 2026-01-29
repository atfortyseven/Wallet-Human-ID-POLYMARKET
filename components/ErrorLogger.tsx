"use client";

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorLog {
    message: string;
    stack?: string;
    timestamp: number;
}

/**
 * ErrorLogger - Captures and displays unhandled errors in production
 * This component helps diagnose black screen issues by showing what went wrong
 */
export function ErrorLogger() {
    const [errors, setErrors] = useState<ErrorLog[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Capture unhandled errors
        const handleError = (event: ErrorEvent) => {
            console.error('[ErrorLogger] Unhandled error:', event.error);
            setErrors(prev => [...prev, {
                message: event.message,
                stack: event.error?.stack,
                timestamp: Date.now()
            }]);
            setIsVisible(true);
        };

        // Capture unhandled promise rejections
        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error('[ErrorLogger] Unhandled rejection:', event.reason);
            setErrors(prev => [...prev, {
                message: `Promise Rejection: ${event.reason?.message || event.reason}`,
                stack: event.reason?.stack,
                timestamp: Date.now()
            }]);
            setIsVisible(true);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    if (!isVisible || errors.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-[9999] max-w-md w-full">
            <div className="bg-red-950/95 border border-red-500/50 rounded-lg shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 border-b border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={20} />
                        <span className="font-mono text-sm font-bold">RUNTIME ERROR</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4 max-h-[400px] overflow-y-auto">
                    {errors.map((error, index) => (
                        <div key={error.timestamp + index} className="mb-4 last:mb-0">
                            <p className="text-sm font-bold text-red-300 mb-1 font-mono">
                                {error.message}
                            </p>
                            {error.stack && (
                                <pre className="text-xs text-zinc-400 whitespace-pre-wrap bg-black/50 p-2 rounded mt-2 border border-white/10">
                                    {error.stack}
                                </pre>
                            )}
                            <p className="text-xs text-zinc-500 mt-1">
                                {new Date(error.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-3 border-t border-red-500/30 bg-black/30">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded transition-colors"
                    >
                        RELOAD APPLICATION
                    </button>
                </div>
            </div>
        </div>
    );
}
