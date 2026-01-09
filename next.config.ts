import type { NextConfig } from "next";

const nextConfig: any = {
  experimental: {
    after: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
