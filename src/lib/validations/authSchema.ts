import { z } from "zod";

export const loginSchema = z.object({
  email: z.preprocess(
    (value) => {
      // 入力値が文字列なら前後の空白を削除、そうでなければ空文字にする
      if (typeof value === "string") return value.trim();
      return "";
    },
    // 必須エラー用の required_error を指定する
    z
      .string({ required_error: "メールアドレスを入力して下さい" })
      .email({ message: "メールアドレスの形式が不正です" })
  ),

  password: z.preprocess((value) => {
    if (typeof value === "string") return value;
    return "";
  }, z.string({ required_error: "パスワードを入力して下さい" })),
});

export type SignInInputs = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.preprocess((value) => {
      if (typeof value === "string") return value.trim();
      return "";
    }, z.string({ required_error: "ユーザー名を入力して下さい" }).max(8, { message: "ユーザー名は8文字以内でお願いします" })),
    email: z.preprocess((value) => {
      if (typeof value === "string") return value.trim();
      return "";
    }, z.string({ required_error: "メールアドレスを入力して下さい" }).email({ message: "メールアドレスの形式が不正です" })),
    password: z.preprocess(
      (value) => {
        if (typeof value === "string") return value;
        return "";
      },
      z
        .string({ required_error: "パスワードを入力して下さい" })
        .regex(/^(?=.*[A-Za-z])(?=.*[0-9])/, {
          message: "少なくとも1つの英字、1つの数字を含んでいる必要があります",
        })
        .min(8, { message: "パスワードは8文字以上でお願いします" })
        .max(100)
    ),
    confirmPassword: z.preprocess((value) => {
      if (typeof value === "string") return value;
      return "";
    }, z.string({ required_error: "パスワードを入力して下さい" })),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードが一致しません",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterInputs = z.infer<typeof registerSchema>;
