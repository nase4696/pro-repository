import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // テストユーザーの作成
  const testUser = await prisma.user.create({
    data: {
      name: "テストユーザー",
      email: "test@example.com",
      password: await hash("password123", 10),
    },
  });

  // テスト掲示板の作成
  const testBoard = await prisma.board.create({
    data: {
      title: "テスト掲示板",
      description: "これはテスト用の掲示板です",
      content: "初期コンテンツ",
      creatorId: testUser.id,
    },
  });

  // テストメッセージの作成
  await prisma.message.create({
    data: {
      content: "これはテストメッセージです",
      authorId: testUser.id,
      boardId: testBoard.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
