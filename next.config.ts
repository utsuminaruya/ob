import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint無視
  },
  typescript: {
    ignoreBuildErrors: true,  // TSエラー無視
  },
};

export default nextConfig;
