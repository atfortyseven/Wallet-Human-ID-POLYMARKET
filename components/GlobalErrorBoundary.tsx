"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Copy } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[GlobalErrorBoundary] Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });

        // Also log to a potential error tracking service
        if (typeof window !== 'undefined') {
            console.error('[GlobalErrorBoundary] Error details:', {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        }
    }

    private copyErrorToClipboard = () => {
        const errorText = `Error: ${this.state.error?.message}\n\nStack:\n${this.state.error?.stack}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
        navigator.clipboard.writeText(errorText).then(() => {
            alert('Error details copied to clipboard');
        });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-mono">
                    <div className="max-w-2xl w-full bg-red-950/20 border border-red-500/30 rounded-xl p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6 text-red-500">
                            <AlertCircle size={48} />
                            <h1 className="text-3xl font-bold tracking-tight">SYSTEM FAILURE</h1>
                        </div>

                        <div className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-6 border border-white/10">
                            <p className="text-sm font-bold text-red-400 mb-2">Error: {this.state.error?.message}</p>
                            <pre className="text-xs text-stone-400 whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack || "No stack trace available"}
                            </pre>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={this.copyErrorToClipboard}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                            >
                                <Copy size={18} />
                                COPY ERROR
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                            >
                                <RefreshCw size={18} />
                                REBOOT SYSTEM
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
