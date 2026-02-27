import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Пустая конфигурация Turbopack для совместимости
  turbopack: {},
  
  // Webpack конфигурация для Three.js
  webpack: (config, { isServer }) => {
    // Исправление для Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
