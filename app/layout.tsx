// CRITICAL: Polyfills MUST load first to fix production black screen
import '@/components/polyfills';

import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { AppProvider } from '@/components/AppContext';
import { WorldProvider } from '@/src/context/WorldContext';
import { Toaster } from 'sonner';
import VoidShell from '@/components/VoidShell';
import BackgroundVideo from '@/components/layout/BackgroundVideo';
import { BootSequence } from '@/components/layout/BootSequence';
import { Footer } from '@/components/layout/Footer';
import { GeoBlocker } from '@/components/logic/GeoBlocker';
import { TermsGate } from '@/components/compliance/TermsGate';
import { BaseGasWidget } from '@/components/compliance/BaseGasWidget';
import RegisterSW from '@/components/pwa/RegisterSW';
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { ErrorLogger } from '@/components/ErrorLogger';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {


    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#000000',
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.humanidfi.com'),
    title: 'HumanID.fi | The Void Wallet',
    description: 'Sybil-resistant financial engine for Polymarket. Built on Base Sepolia.',
    icons: {
        icon: [
            { url: '/logo.png', sizes: 'any' },
            { url: '/assets/icon-16.png', sizes: '16x16', type: 'image/png' },
            { url: '/assets/icon-48.png', sizes: '48x48', type: 'image/png' },
            { url: '/assets/icon-128.png', sizes: '128x128', type: 'image/png' },
        ],
        apple: [
            { url: '/assets/icon-128.png', sizes: '128x128', type: 'image/png' },
        ],
    },
    openGraph: {
        title: 'HumanID.fi | Sovereign Intelligence',
        description: 'Identity-First Decentralized Finance. Verify your humanity, access the global intel feed.',
        url: 'https://www.humanidfi.com',
        siteName: 'HumanID.fi',
        images: [
            {
                url: '/og-void.jpg', // Relative path now works with metadataBase
                width: 1200,
                height: 630,
                alt: 'HumanID Upgrade',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HumanID.fi | The Void Wallet',
        description: 'Sybil-resistant financial engine for Polymarket.',
        creator: '@HumanID_fi',
        images: ['/og-void.jpg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
            <head>
                {/* CRITICAL: Inline error capture BEFORE any modules load */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                    (function() {
                        var errors = [];
                        var originalConsoleError = console.error;
                        
                        // Capture all errors
                        window.addEventListener('error', function(e) {
                            errors.push({
                                type: 'error',
                                message: e.message,
                                source: e.filename,
                                line: e.lineno,
                                stack: e.error?.stack
                            });
                            console.error('[PRE-REACT ERROR]', e.message, e.error);
                            
                            // Show visible error on page
                            showError('JavaScript Error: ' + e.message);
                        });
                        
                        window.addEventListener('unhandledrejection', function(e) {
                            errors.push({
                                type: 'rejection',
                                reason: e.reason?.message || e.reason
                            });
                            console.error('[PRE-REACT REJECTION]', e.reason);
                            showError('Promise Rejection: ' + (e.reason?.message || e.reason));
                        });
                        
                        function showError(msg) {
                            var div = document.createElement('div');
                            div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff0000;color:#fff;padding:20px;font-family:monospace;font-size:14px;z-index:999999;border-bottom:3px solid #fff;';
                            div.innerHTML = '🚨 <strong>CRITICAL ERROR DETECTED</strong><br>' + msg + '<br><button onclick="window.location.reload()" style="margin-top:10px;padding:8px 16px;background:#fff;color:#000;border:none;cursor:pointer;font-weight:bold;">RELOAD PAGE</button>';
                            document.body?.appendChild(div) || setTimeout(function() { document.body.appendChild(div); }, 100);
                        }
                        
                        // Make errors accessible
                        window.__DIAGNOSTIC_ERRORS = errors;
                        
                        console.log('[PRE-REACT] Error capture initialized');
                    })();
                ` }} />
            </head>
            <body className="relative min-h-screen">
                {/* Immediate loading indicator - shows BEFORE React loads */}
                <noscript>
                    <div style={{ background: '#000', color: '#f00', padding: '40px', textAlign: 'center', fontFamily: 'monospace' }}>
                        <h1>⚠️ JavaScript Required</h1>
                        <p>This application requires JavaScript to run. Please enable JavaScript in your browser.</p>
                    </div>
                </noscript>

                {/* Loading fallback that shows immediately */}
                <div id="__next_loading" style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00f2ea',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    zIndex: 9999
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="animate-pulse">LOADING HUMANID.FI...</div>
                        <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
                            If this screen persists, check console (F12) for errors
                        </div>
                    </div>
                </div>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    // Remove loading screen after 5 seconds or when page loads
                    setTimeout(function() {
                        var loader = document.getElementById('__next_loading');
                        if (loader && document.querySelector('#__next > *')) {
                            loader.style.display = 'none';
                        }
                    }, 5000);
                    
                    window.addEventListener('load', function() {
                        setTimeout(function() {
                            var loader = document.getElementById('__next_loading');
                            if (loader) loader.style.display = 'none';
                        }, 1000);
                    });
                ` }} />
                <Providers>
                    <GlobalErrorBoundary>
                        <ErrorLogger />
                        <RegisterSW />
                        <TermsGate />
                        <GeoBlocker />
                        <BootSequence />
                        <BackgroundVideo />
                        <BaseGasWidget />
                        <AppProvider>
                            <WorldProvider>
                                <VoidShell>
                                    {children}
                                    <Footer />
                                </VoidShell>
                                <Toaster richColors theme="dark" />
                            </WorldProvider>
                        </AppProvider>
                    </GlobalErrorBoundary>
                </Providers>
            </body>
        </html>
    );
}
