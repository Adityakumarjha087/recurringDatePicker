import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production to avoid exposing source code
  productionBrowserSourceMaps: false,
  
  // Configure webpack to handle specific module resolutions
  webpack: (config, { isServer }) => {
    // This fixes npm packages that depend on `module` field
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any necessary aliases here
    };

    return config;
  },
  
  // Configure images
  images: {
    domains: [],
    minimumCacheTTL: 60, // 1 minute
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Configure TypeScript
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
  },
  
  // Configure static file handling
  experimental: {
    // Enable modern browser optimizations
    optimizeCss: true,
    // Enable webpack 5 persistent caching
    webpackBuildWorker: true,
  },
};

export default nextConfig;
