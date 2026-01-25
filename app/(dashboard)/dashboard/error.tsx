"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center max-w-md text-center">
                <div className="bg-red-500/20 p-4 rounded-full mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
                <p className="text-gray-400 text-sm mb-6">
                    {error.message || "An unexpected client-side error occurred."}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
