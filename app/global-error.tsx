
'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black text-white flex items-center justify-center min-h-screen">
                <div className="text-center p-8 space-y-4">
                    <h2 className="text-3xl font-bold text-red-600">Critical System Error</h2>
                    <p className="text-gray-400 font-mono">
                        The integrity of the application has been compromised.
                    </p>
                    <pre className="text-xs text-red-900/50 bg-black border border-red-900/20 p-4 rounded overflow-auto max-w-lg mx-auto">
                        {error.message}
                    </pre>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
                    >
                        Reboot System
                    </button>
                </div>
            </body>
        </html>
    );
}
