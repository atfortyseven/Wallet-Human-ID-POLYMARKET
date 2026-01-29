/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Exportación estática obligatoria
    trailingSlash: true, // VITAL for extension routing
    distDir: 'out',

    images: {
        unoptimized: true, // Required for extensions
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

    // WEBPACK (Wagmi/RainbowKit Polyfills)
    webpack: (config, { webpack }) => {
        config.resolve.fallback = { fs: false, net: false, tls: false, buffer: require.resolve('buffer/') };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
        };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        );

        return config;
    },
};

module.exports = nextConfig;
