/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  env: { SERVER_API_URL: process.env.SERVER_API_URL },
  publicRuntimeConfig: {
    manifestPath: '/manifest.json',
  },
};

export default nextConfig;
