/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental block removed to avoid workspace inference

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;