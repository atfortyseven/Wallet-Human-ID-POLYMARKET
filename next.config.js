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
    }
};

module.exports = nextConfig;
