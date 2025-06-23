"use server";

import {
  getMessage,
  MessageCreate,
  MessageDelete,
} from "@/lib/message/message-data-fetcher";
import { getServerSession } from "@/lib/session";
import { MessageSchema } from "@/lib/validations/message-schema";
import { parseWithZod } from "@conform-to/zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const MessagePostAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: MessageSchema,
  });

  const extractBoardId = (url: string) => {
    const match = url.match(/\/bbs\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const currentUrl = (await headers()).get("x-url") || "";
  const boardId = extractBoardId(currentUrl);

  if (!boardId) {
    return submission.reply({
      formErrors: ["掲示板の特定に失敗しました"],
    });
  }

  console.log("headerList:", currentUrl);
  console.log("boardId:", boardId);

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { message } = submission.value;

  try {
    // エラー処理動作確認用
    if (message.includes("TEST_ERROR")) {
      throw new PrismaClientKnownRequestError("Test error", {
        code: "P2002",
        clientVersion: "test",
      });
    }

    await MessageCreate(message, boardId);

    revalidatePath(`/bbs/${boardId}`);
  } catch (error) {
    console.error("error:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      return submission.reply({
        formErrors: [
          "メッセージの投稿に失敗しました。時間を空けてから再度お試し下さい。",
        ],
      });
    }

    throw new Error("予期しないエラーが発生しました");
  }

  return submission.reply();
};

export async function messageDeleteAction(messageId: string, bbsId: string) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    const message = await getMessage(messageId);

    if (message?.authorId !== session.user.id) {
      return {
        error: "削除権限がありません",
      };
    }
    await MessageDelete(messageId);
    revalidatePath(`/bbs/${bbsId}`);
    return { success: true };
  } catch (error) {
    console.error("deleteError:", JSON.stringify(error, null, 2));
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        error:
          "処理中にエラーが発生しました。時間を空けてから再度お試しください。",
      };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "予期しないエラーが発生しました",
    };
  }
}
