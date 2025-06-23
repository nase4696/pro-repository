import { z } from "zod";

export const bbsSchema = z.object({
  title: z
    .string({ required_error: "タイトルを入力して下さい" })
    .max(13, { message: "タイトルは13文字以内にして下さい" }),
  description: z
    .string({
      required_error: "掲示板の概要を入力して下さい",
    })
    .max(20, { message: "概要は20文字以内にして下さい" }),
  content: z
    .string({ required_error: "掲示板の内容を入力して下さい" })
    .max(200, { message: "200文字以内でお願いします" }),
});
