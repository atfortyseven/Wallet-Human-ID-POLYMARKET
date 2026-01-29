'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[ERROR.TSX] Application error:', error);
    }, [error]);

    return (
        <html>
            <body style={{
                background: '#000',
                color: '#fff',
                fontFamily: 'monospace',
                padding: '40px',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    maxWidth: '600px',
                    background: 'rgba(255,0,0,0.1)',
                    border: '2px solid #f00',
                    borderRadius: '12px',
                    padding: '30px'
                }}>
                    <h1 style={{ color: '#f00', marginBottom: '20px', fontSize: '24px' }}>
                        🚨 APPLICATION ERROR
                    </h1>

                    <div style={{
                        background: '#111',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        overflow: 'auto'
                    }}>
                        <p style={{ color: '#f88', marginBottom: '10px', fontWeight: 'bold' }}>
                            {error.message || 'Unknown error occurred'}
                        </p>
                        {error.digest && (
                            <p style={{ color: '#888', fontSize: '12px' }}>
                                Error ID: {error.digest}
                            </p>
                        )}
                        {error.stack && (
                            <pre style={{
                                fontSize: '10px',
                                color: '#666',
                                marginTop: '10px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {error.stack}
                            </pre>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={reset}
                            style={{
                                flex: 1,
                                padding: '12px 24px',
                                background: '#f00',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontFamily: 'monospace'
                            }}
                        >
                            TRY AGAIN
                        </button>
                        <button
                            onClick={() => window.location.href = '/diagnostic.html'}
                            style={{
                                flex: 1,
                                padding: '12px 24px',
                                background: '#333',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontFamily: 'monospace'
                            }}
                        >
                            RUN DIAGNOSTIC
                        </button>
                    </div>

                    <p style={{
                        marginTop: '20px',
                        fontSize: '12px',
                        color: '#888',
                        textAlign: 'center'
                    }}>
                        Press F12 to open the browser console for more details
                    </p>
                </div>
            </body>
        </html>
    );
}
