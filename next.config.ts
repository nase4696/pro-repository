import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // サーバーサイドのみで使うパッケージを指定
  serverExternalPackages: ["bcryptjs"],

  // その他の設定
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
