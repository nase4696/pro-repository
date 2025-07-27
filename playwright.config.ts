import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // テスト全体の設定
  timeout: 120000, // テスト1つのタイムアウト時間
  retries: 3, // 失敗時のリトライ回数
  // グローバル設定を追加
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",

  // レポート設定
  reporter: [
    ["html", { outputFolder: "playwright-report" }], // HTMLレポート
    ["list"], // コンソール表示
  ],

  // テスト環境設定
  use: {
    baseURL: "http://localhost:3000", // ベースURL
    trace: "on-first-retry", // エラー時にトレースを記録
    screenshot: "only-on-failure", // 失敗時にスクリーンショット
    storageState: "storageState.json",
    bypassCSP: true,
    // モジュール解決を明示的に指定
    contextOptions: {
      serviceWorkers: "block",
    },
  },

  // テストプロジェクト（ブラウザ別）
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // 必要に応じて他のブラウザを追加
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  // Webサーバー起動設定（開発サーバーを自動起動）
  webServer: {
    command: "npm run dev", // 開発サーバー起動コマンド
    url: "http://localhost:3000", // アクセスURL
    reuseExistingServer: !process.env.CI, // CI環境以外でサーバー再利用
    timeout: 120 * 1000, // サーバー起動待機時間（120秒）
  },
});
