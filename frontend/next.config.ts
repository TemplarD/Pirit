import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем Turbopack из-за проблем с правами доступа
  experimental: {
    // turbopack: false,
  },
  // Явно указываем порт
  // Для запуска: npx next dev -p 3002
};

export default nextConfig;
