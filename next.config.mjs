/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'tokens.1inch.io',
      },
      {
        protocol: 'https',
        hostname: '**.trustwallet.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coincap.io',
      },
      {
        protocol: 'https',
        hostname: 'token-icons.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'arbitrum.foundation',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
      }
    ],
  },
};

export default nextConfig;
