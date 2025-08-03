"use server";

import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "@/lib/validations/authSchema";
import { prisma } from "@/lib/prisma";
import { parseWithZod } from "@conform-to/zod";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation.js";
import { AuthError } from "next-auth";
import { UserCreate } from "@/lib/user/user-data-fetcher";

export const registerAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const from = formData.get("redirect_to")?.toString() || "/home";

  const submission = parseWithZod(formData, {
    schema: registerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.value;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return submission.reply({
      formErrors: ["このメールアドレスはすでに登録されています"],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCreate(submission.value, hashedPassword);

  await signIn("credentials", {
    email,
    password,
    // redirectは無くても問題なさそう
    // redirect: true,
    redirectTo: `${from}?toast_code=register_success&redirect_to=${formData.get(
      "redirect_to"
    )}`,
  });

  return submission.reply();
};

export const signInAction = async (prevState: unknown, formData: FormData) => {
  const from = formData.get("redirect_to")?.toString() || "/home";

  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await signIn("credentials", {
      email: submission.value.email,
      password: submission.value.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // ユーザー入力エラー
      switch (error.type) {
        case "CredentialsSignin":
          return submission.reply({
            formErrors: ["メールアドレスまたはパスワードが間違っています"],
          });
        default:
          return submission.reply({
            formErrors: [
              "ログインに失敗しました。入力内容を確認して再度お試し下さい。",
            ],
          });
      }
    }
    throw new Error("システムエラーが発生しました。再度お試しください");
  }

  let url = `${from}?toast_code=login_success`;
  const redirectTo = formData.get("redirect_to");
  if (redirectTo) {
    url += `&redirect_to=${redirectTo.toString()}`;
  }
  redirect(url);
};

export const signOutAction = async () => {
  await signOut({
    redirect: true,
    redirectTo: "/?toast_code=signout_success&redirect_to=/",
  });
};
