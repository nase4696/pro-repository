import prismaMock from "@/mocks/prisma";

// モック設定
vi.mock("server-only", () => ({
  __esModule: true,
  default: () => ({}),
}));

import { AuthError } from "next-auth";

const { signInMock, redirectMock, signOutMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  redirectMock: vi.fn(),
  signOutMock: vi.fn(),
}));

// モジュールモック
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/auth", () => ({
  signIn: signInMock,
  signOut: signOutMock,
}));

import {
  signInAction,
  signOutAction,
  registerAction,
} from "@/actions/registerUser";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("signInAction", () => {
  beforeEach(() => {
    // モックリセット方法変更
    redirectMock.mockClear();
    signInMock.mockClear();
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

describe("signOutAction", () => {
  test("ログアウト後にトップページにリダイレクトされる", async () => {
    await signOutAction();

    expect(signOutMock).toHaveBeenCalledWith({
      redirect: true,
      redirectTo: "/?toast_code=signout_success&redirect_to=/",
    });
  });
});

describe("registerAction", () => {
  test("登録に成功してログインされる", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null); // 「ユーザーはいません」
    prismaMock.user.create.mockResolvedValue({
      id: "1",
      name: "ken",
      email: "test@example.com",
      password: "correctPassword123",
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "correctPassword123");
    formData.append("name", "ken");
    formData.append("confirmPassword", "correctPassword123");
    formData.append("redirect_to", "/dashboard");

    const result = await registerAction(null, formData);

    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.create).toHaveBeenCalled();

    expect(signInMock).toHaveBeenCalledWith(
      "credentials", // 第一引数
      {
        // 第二引数（オブジェクト）
        email: "test@example.com",
        password: "correctPassword123",
        redirectTo:
          "/dashboard?toast_code=register_success&redirect_to=/dashboard",
      }
    );
  });

  test("すでに存在するメールアドレスで登録するとエラー", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "1",
      name: "ken",
      email: "existing@example.com",
      password: "correctPassword123",
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append("email", "existing@example.com");
    formData.append("password", "correctPassword123");
    formData.append("name", "ken");
    formData.append("confirmPassword", "correctPassword123");

    const result = await registerAction(null, formData);

    expect(result.error?.[""]).toContain(
      "このメールアドレスはすでに登録されています"
    );
  });

  test("不正な入力でバリデーションエラーが発生する", async () => {
    const formData = new FormData();
    formData.append("email", "invalid.com");
    formData.append("password", "invalidPassword");
    formData.append("name", "longUserName");
    formData.append("confirmPassword", "differentPassword");

    const result = await registerAction(null, formData);

    expect(result.error?.name).toContain("ユーザー名は8文字以内でお願いします");
    expect(result.error?.email).toContain("メールアドレスの形式が不正です");
    expect(result.error?.password).toContain(
      "少なくとも1つの英字、1つの数字を含んでいる必要があります"
    );
    expect(result.error?.confirmPassword).toContain("パスワードが一致しません");
  });

  test("不正な入力でバリデーションエラーが発生する", async () => {
    const formData = new FormData();
    formData.append("email", "invalid.com");
    formData.append("password", "invalidPassword");
    formData.append("name", "longUserName");
    formData.append("confirmPassword", "differentPassword");

    const result = await registerAction(null, formData);

    expect(result.error?.name).toContain("ユーザー名は8文字以内でお願いします");
    expect(result.error?.email).toContain("メールアドレスの形式が不正です");
    expect(result.error?.password).toContain(
      "少なくとも1つの英字、1つの数字を含んでいる必要があります"
    );
    expect(result.error?.confirmPassword).toContain("パスワードが一致しません");
  });
});
