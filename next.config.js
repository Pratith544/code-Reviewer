/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images:    { unoptimized: true },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: require.resolve("encoding"),
    };
    return config;
  },
};

module.exports = nextConfig;
