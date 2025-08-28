/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Thêm các config debug
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: [
      'mongodb', 
      'bcryptjs', 
      'jsonwebtoken',
      '@mongodb-js/zstd',
      'kerberos',
      'snappy',
      'socks'
    ]
  },
  // Webpack config để handle các dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      })
    }
    return config
  }
}

export default nextConfig