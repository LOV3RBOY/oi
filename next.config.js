/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 10000,
      maxSize: 250000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true
        },
        framerMotion: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          chunks: 'all',
          priority: 35
        },
        threejs: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'threejs',
          chunks: 'all',
          priority: 35
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 20
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          chunks: 'all',
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        }
      }
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three', 'framer-motion']
  },
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "connect-src 'self' blob: data:",
              "img-src 'self' data: blob: https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
              "media-src 'self' blob: data:",
              "style-src 'self' 'unsafe-inline'",
              "worker-src 'self' blob:",
            ].join('; ')
          },
        ],
      },
    ];
  }
}

module.exports = nextConfig

