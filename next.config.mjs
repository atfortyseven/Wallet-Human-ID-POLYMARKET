/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'plus.unsplash.com' },
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'loremflickr.com' },
            // AÑADIDO: Necesario para los avatares reales del Leaderboard
            { protocol: 'https', hostname: 'i.pravatar.cc' },
        ],
    },
    // OPTIMIZATION: Disable checks during deploy to prevent OOM/Timeouts
    // OPTIMIZATION: Checks enabled for stability
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // ESTA PARTE ES SAGRADA: Mantiene viva la conexión Web3
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
        };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
};

export default nextConfig;