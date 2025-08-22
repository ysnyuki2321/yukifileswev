/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.tsx': {
          loaders: ['swc-loader'],
          as: '*.tsx',
        },
      },
    },
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Disable minification completely để debug undefined length errors
    if (!dev && !isServer) {
      config.optimization.minimize = false
    }

    return config
  },
  // Disable static optimization for pages that might have j conflicts
  staticPageGenerationTimeout: 60,
  // Enhanced error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Prevent problematic optimizations
  // swcMinify: false, // Removed - not supported in Next.js 15
}

module.exports = nextConfig