import { expect, test } from "@playwright/test";

test("ログインに成功してホームページに遷移する", async ({ page }) => {
  await page.goto("http://localhost:3001/login");
  await page.getByLabel("メールアドレス").fill("test@example.com");
  await page.getByLabel("パスワード").fill("password123");

  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("http://localhost:3001/home");
  await expect(page.getByText("ログインしました")).toBeVisible();
});
