import { expect, test } from "@playwright/test";

test("ログインに成功してホームページに遷移する", async ({ page }) => {
  await page.goto("http://localhost:3001/login");
  await page.getByLabel("メールアドレス").fill("test@example.com");
  await page.getByLabel("パスワード").fill("password123");

  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("http://localhost:3001/home");
  await expect(page.getByText("ログインしました")).toBeVisible();
});

test("新規登録に成功してホームページに遷移する", async ({ page }) => {
  await page.goto("http://localhost:3001/register");

  await page.getByLabel("ユーザーネーム").fill("新規ユーザー");
  await page.getByLabel("メールアドレス").fill("signup@example.com");
  await page.getByTestId("password-input").fill("password123");
  await page.getByTestId("password-confirm-input").fill("password123");

  await page.getByTestId("signup-button").click();

  await expect(page).toHaveURL("http://localhost:3001/home");
  await expect(page.getByText("新規登録が完了しました")).toBeVisible();
  await expect(page.getByText("新規ユーザー")).toBeVisible();
});

test("未入力で新規登録ボタンをクリックするとエラーメッセージが表示される", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/register");

  await page.getByTestId("signup-button").click();

  await expect(page.getByText("ユーザー名を入力して下さい")).toBeVisible();
  await expect(page.getByText("メールアドレスを入力して下さい")).toBeVisible();

  await expect(page).not.toHaveURL("http://localhost:3001/home");
});
