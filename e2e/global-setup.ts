import { chromium } from "@playwright/test";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function globalSetup() {
  // テスト用ユーザーの作成・確認
  const testUserEmail = "test@example.com";
  const testPassword = "password123";

  console.log("接続DB:", process.env.DATABASE_URL);

  let testUser = await prisma.user.findUnique({
    omit: { password: false },
    where: { email: testUserEmail },
  });

  if (!testUser) {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    testUser = await prisma.user.create({
      data: {
        name: "テストユーザー",
        email: testUserEmail,
        password: hashedPassword,
      },
    });
  }

  // ブラウザ操作でログイン
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3001/login");

  // ログインフォームに入力
  await page.getByLabel("メールアドレス").fill(testUserEmail);
  await page.getByLabel("パスワード").fill("password123");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();

  console.log("入力パスワード:", "password123");
  console.log("ハッシュ化済み:", testUser.password);

  // ログイン成功を確認（ホームページに遷移）
  await page.waitForURL("http://localhost:3001/home", { timeout: 60000 });

  // 認証状態を保存
  await context.storageState({ path: "storageState.json" });
  await browser.close();
}

export default globalSetup;
