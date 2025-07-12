import { mock, describe, expect, test, beforeEach } from "bun:test"; // 最初にモックをインポート

// 絶対に最初にserver-onlyをモック
mock.module("server-only", () => ({
  __esModule: true,
  default: () => ({}), // 関数形式でダミー実装
}));

const { signInAction } = await import("@/actions/registerUser");
import { AuthError } from "next-auth";

const redirectMock = mock();
const signInMock = mock();

mock.module("next/navigation", () => ({
  redirect: redirectMock,
}));

mock.module("@/auth", () => ({
  // 追加
  signIn: signInMock,
}));

describe("signInAction", () => {
  beforeEach(() => {
    redirectMock.mockReset(); // 呼び出し履歴をクリア
    signInMock.mockReset(); // 設定もリセット
  });

  test("正しい認証情報でリダイレクト", async () => {
    // 認証成功をモック
    signInMock.mockResolvedValue({ ok: true });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "correctPassword");
    formData.append("redirect_to", "/dashboard");

    await signInAction(null, formData);

    expect(redirectMock).toHaveBeenCalled();

    expect(redirectMock).toHaveBeenCalledWith(
      "/dashboard?toast_code=login_success&redirect_to=/dashboard"
    );
  });

  test("リダイレクト先指定なしでデフォルト移動", async () => {
    // 認証成功をモック
    signInMock.mockResolvedValue({ ok: true });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "correctPassword");

    await signInAction(null, formData);

    expect(redirectMock).toHaveBeenCalledWith("/home?toast_code=login_success");
  });

  test("間違ったパスワードでエラー表示", async () => {
    const error = new AuthError();
    error.type = "CredentialsSignin"; // タイプを明示的に設定

    signInMock.mockRejectedValue(error);

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "wrongPassword");
    formData.append("redirect_to", "/dashboard");

    const result = await signInAction(null, formData);

    // エラーメッセージを正しい場所で確認
    expect(result.error?.[""]).toContain(
      "メールアドレスまたはパスワードが間違っています"
    );
  });

  // システムエラーテスト
  test("認証システムエラー時の処理", async () => {
    // 予期せぬエラーをモック
    signInMock.mockRejectedValue(new Error("DB接続エラー"));

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    // エラーがスローされることを確認
    await expect(signInAction(null, formData)).rejects.toThrow(
      "システムエラーが発生しました"
    );
  });

  // 無効なメール形式のテスト
  test("不正なメールアドレスでバリデーションエラーが発生する", async () => {
    const formData = new FormData();
    formData.append("email", "wrongEmail");
    formData.append("password", "wrongPassword");

    const result = await signInAction(null, formData);

    // エラーメッセージを正しい場所で確認
    expect(result.status).toBe("error");
  });
});
