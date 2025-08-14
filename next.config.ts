import type { NextConfig } from "next";

const isTestEnv = process.env.NODE_ENV === "test";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // テスト環境では.env.testを読み込む
    envPath: isTestEnv ? ".env.test" : ".env.local",
  },
};

export default nextConfig;
