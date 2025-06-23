import { z } from "zod";

export const MessageSchema = z.object({
  message: z
    .string({ required_error: "メッセージが入力されていません" })
    .max(200, { message: "メッセージは200文字以内にして下さい" }),
});
