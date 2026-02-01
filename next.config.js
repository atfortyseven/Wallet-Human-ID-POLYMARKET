const isExtension = process.env.EXT_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: isExtension,
    distDir: isExtension ? 'out' : '.next',

    images: {
        unoptimized: isExtension,
        remotePatterns: [
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'cdn.weatherapi.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'plus.unsplash.com' },
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'loremflickr.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: 'cryptologos.cc' },
        ]
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self' https: wss:; img-src 'self' https: data: blob:; connect-src 'self' https: wss: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: https://www.gstatic.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:;",
                    },
                ],
            },
        ];
    },

    reactStrictMode: true,
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,

    typescript: {
        ignoreBuildErrors: true
    },

    // Turbopack config (Next.js 16)
    turbopack: {},

    // External packages
    serverExternalPackages: [
        '@prisma/client',
        'prisma',
        'bcryptjs',
        '@xmtp/browser-sdk',
        'ethers',
        'web3',
        '@walletconnect/ethereum-provider',
        'socket.io',
        'stripe'
    ],

    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
};

module.exports = nextConfig;
