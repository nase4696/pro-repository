"use server";

import { BbsCreate, BbsDelete, BbsUpdate } from "@/lib/bbs/bbs-data-fetcher";
import { getServerSession } from "@/lib/session";
import { bbsSchema } from "@/lib/validations/bbsSchema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Board } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation.js";

export const bbsCreateAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: bbsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { content } = submission.value;

  try {
    if (content.includes("TEST_ERROR")) {
      throw new PrismaClientKnownRequestError("Test error", {
        code: "P2002",
        clientVersion: "test",
      });
    }

    await BbsCreate(submission.value);
  } catch (error) {
    console.error("error:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      return submission.reply({
        formErrors: [
          "掲示板の作成に失敗しました。時間を空けてから再度お試し下さい。",
        ],
      });
    }
    throw new Error("予期しないエラーが発生しました");
  }

  return submission.reply();
};

export type BbsActionResult = SubmissionResult & {
  status?: "success" | "error";
  data?: Board | null;
};

export const bbsUpdateAction = async (
  prevState: unknown,
  formData: FormData
): Promise<BbsActionResult> => {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const currentUrl = (await headers()).get("x-url") || "";

  // URLから編集IDを抽出（例: /bbs/editor/123 → 123）
  const editorId =
    currentUrl.match(/\/bbs\/editor\/([a-zA-Z0-9-_]+)/)?.[1] || "";

  const submission = parseWithZod(formData, {
    schema: bbsSchema,
  });

  if (!editorId) {
    return submission.reply({
      formErrors: ["対象の掲示板を特定できませんでした。"],
    });
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await BbsUpdate(editorId, submission.value);

    revalidatePath(`/bbs/editor/${editorId}`);
  } catch (error) {
    console.error("error:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      return submission.reply({
        formErrors: [
          "掲示板の編集に失敗しました。時間を空けてから再度お試し下さい。",
        ],
      });
    }
    throw new Error("予期しないエラーが発生しました");
  }

  redirect("/bbs/editor?toast_code=edit_success&redirect_to=/bbs/editor");
};

export async function bbsDeleteAction(postId: string) {
  try {
    if (!postId) {
      return { error: "投稿IDが不正です" };
    }

    await BbsDelete(postId);
    revalidatePath("/bbs/editor");
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
