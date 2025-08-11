import { expect, test } from "@playwright/test";

test("掲示板を作成するとトーストメッセージが表示される", async ({ page }) => {
  await page.goto("http://localhost:3001/home");
  await page.getByRole("link", { name: "掲示板の作成" }).click();
  await page.getByLabel("掲示板タイトル").fill("testBoard");
  await page.getByLabel("概要").fill("testOverview");
  await page.getByLabel("投稿内容").fill("testContent");

  await page.getByRole("button", { name: "作成" }).click();

  await expect(page.getByText("掲示板を作成しました")).toBeVisible();
});

test("掲示板を編集すると編集ページに遷移し、トーストメッセージが表示される", async ({
  page,
}) => {
  const updateBoardTitle = "testBoard";

  // 編集ページに移動
  await page.goto("http://localhost:3001/home");
  await page.getByRole("link", { name: "掲示板の編集" }).click();
  await expect(page).toHaveURL("http://localhost:3001/bbs/editor");

  // シードデータの掲示板を特定
  const updateBoard = page
    .getByTestId("board-item")
    .filter({ hasText: updateBoardTitle });

  // シードデータの編集ボタンを取得
  const editButton = updateBoard.getByTestId("desktop-edit-button");

  await editButton.click();

  // 編集ページにいることを確認
  await expect(page).toHaveURL(/\/bbs\/editor\/.+/);

  // 編集内容を入力
  await page.getByLabel("掲示板タイトル").fill("変更後のタイトル");
  await page.getByLabel("投稿内容").fill("変更後の内容");

  // 更新ボタンをクリック
  await page.getByRole("button", { name: "更新" }).click();

  // 編集一覧ページに戻り、トーストが表示されることを確認
  await expect(page).toHaveURL("http://localhost:3001/bbs/editor");
  await expect(page.getByText("掲示板を更新しました")).toBeVisible();
});

test("掲示板を削除すると対象の掲示板が削除される", async ({ page }) => {
  const deleteBoardTitle = "変更後のタイトル";

  // 編集ページに移動
  await page.goto("http://localhost:3001/home");
  await page.getByRole("link", { name: "掲示板の編集" }).click();
  await expect(page).toHaveURL("http://localhost:3001/bbs/editor");

  const deleteBoard = page
    .getByTestId("board-item")
    .filter({ hasText: deleteBoardTitle });

  const deleteButton = deleteBoard.getByRole("button", { name: "削除" });

  await deleteButton.click();

  await expect(page.getByText("本当に削除しますか？")).toBeVisible();

  await page.getByRole("button", { name: "はい" }).click();

  await expect(deleteBoard).not.toBeVisible();
});
