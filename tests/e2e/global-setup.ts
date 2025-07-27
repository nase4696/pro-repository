import { chromium } from "@playwright/test";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function globalSetup() {
  // テスト用ユーザーの作成・確認
  const testUserEmail = "test@example.com";
  let testUser = await prisma.user.findUnique({
    where: { email: testUserEmail },
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        name: "テストユーザー",
        email: testUserEmail,
        password: await hash("password123", 10),
      },
    });
  }

  // ブラウザ操作でログイン
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000/login");

  // ログインフォームに入力
  await page.getByLabel("メールアドレス").fill(testUserEmail);
  await page.getByLabel("パスワード").fill("password123");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();

  // ログイン成功を確認（ホームページに遷移）
  await page.waitForURL("http://localhost:3000/home", { timeout: 60000 });

  // 認証状態を保存
  await context.storageState({ path: "storageState.json" });
  await browser.close();
}

export default globalSetup;
