import { defineConfig } from "vitest/config";
import path from "path"; // 追加する

export default defineConfig({
  test: {
    environment: "jsdom",
    // globals: false, // グローバル変数（expectなど）を無効にする
    setupFiles: "./tests/setup.ts",
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    exclude: [
      "**/*.spec.ts", // 拡張子が.spec.tsのファイルをすべて除外
      "**/node_modules/**",
      "**/dist/**",
    ],
    deps: {
      inline: ["next", "next-auth"], // Next関連モジュールをバンドル
    },
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/navigation": "next/navigation.js",
    },
  },
});
