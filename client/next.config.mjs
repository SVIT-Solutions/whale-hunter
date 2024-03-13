/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  env: { REACT_APP_GRAPHQL_ENDPOINT: process.env.REACT_APP_GRAPHQL_ENDPOINT },
  publicRuntimeConfig: {
    manifestPath: '/manifest.json',
  },
};

export default nextConfig;
