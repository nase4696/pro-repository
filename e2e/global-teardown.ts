import { prisma } from "@/lib/prisma";

export default async function () {
  try {
    // シードデータ以外のメッセージを削除
    await prisma.message.deleteMany({
      where: {
        NOT: { content: "これはテストメッセージです" },
      },
    });
    // シードデータ以外の掲示板を削除
    await prisma.board.deleteMany({
      where: {
        NOT: { title: "テスト掲示板" },
      },
    });

    // シードデータ以外のユーザーを削除
    await prisma.user.deleteMany({
      where: {
        NOT: { email: "test@example.com" },
      },
    });
  } catch (error) {
    console.error("グローバルティアダウン中にエラーが発生しました:", error);
    process.exit(1);
  }
}
