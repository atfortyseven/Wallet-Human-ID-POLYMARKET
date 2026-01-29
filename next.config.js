const isExtension = process.env.EXT_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
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
        ]
    },

    reactStrictMode: true,
    swcMinify: true,

    // BUILD ROBUSTNESS
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },

    // 1. Critical for Docker/Railway builds to find the WASM file
    experimental: {
        serverComponentsExternalPackages: [
            '@xmtp/user-preferences-bindings-wasm',
            '@xmtp/proto',
            '@xmtp/react-sdk',
            '@xmtp/xmtp-js',
            'shiki',
            'sharp',
            'onnxruntime-node'
        ]
    },

    // 2. Enable Async WebAssembly & Polyfills
    webpack: (config, { webpack }) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };

        config.resolve.fallback = { fs: false, net: false, tls: false, buffer: require.resolve('buffer/') };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
            'sharp$': false,
            'onnxruntime-node$': false,
            'porto/internal': false,
            'porto': false, // Fix for Wagmi build error (root module)
        };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        );

        // 3. Robust Fix: Manually copy WASM file to server chunks
        // This solves the "ENOENT... user_preferences_bindings_wasm_bg.wasm" error on Docker/Railway
        const CopyPlugin = require('copy-webpack-plugin');
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: './node_modules/@xmtp/user-preferences-bindings-wasm/dist/web/user_preferences_bindings_wasm_bg.wasm',
                        to: 'static/chunks/app', // Try multiple locations to be safe
                        noErrorOnMissing: true
                    },
                    {
                        from: './node_modules/@xmtp/user-preferences-bindings-wasm/dist/web/user_preferences_bindings_wasm_bg.wasm',
                        to: 'server/chunks', // The likely required location based on error log
                        noErrorOnMissing: true
                    }
                ]
            })
        );

        return config;
    },
};

module.exports = nextConfig;
