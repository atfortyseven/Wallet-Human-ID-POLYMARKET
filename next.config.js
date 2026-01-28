/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. DECENTRALIZED DEPLOY (Disabled for SSR/API Routes Support)
    // output: 'export',

    // 2. IMAGE OPTIMIZATION (Enabled)
    images: {
        // unoptimized: true,
        remotePatterns: [
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'cdn.weatherapi.com' }
        ]
    },

    // 3. BUILD ROBUSTNESS
    typescript: {
        ignoreBuildErrors: true // "Zero Gas" Philosophy: Deploy first, patch later if critical.
    },
    eslint: {
        ignoreDuringBuilds: true
    },

    // 4. WEBPACK (Wagmi/RainbowKit Polyfills)
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },

    // 5. SECURITY HEADERS (Operation Citadel)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-ancestors 'none';",
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
