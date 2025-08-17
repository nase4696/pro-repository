import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const createTestPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // 明示的に環境変数から取得
      },
    },
  });
};

const prisma = createTestPrismaClient();

async function main() {
  // テストユーザーの作成（既存なら更新）
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "テストユーザー",
      email: "test@example.com",
      password: await hash("password123", 10),
    },
  });

  // テスト掲示板の作成
  await prisma.board.create({
    data: {
      title: "テスト掲示板",
      description: "これはテスト用の掲示板です",
      content: "初期コンテンツ",
      creatorId: testUser.id,
    },
  });
}

main()
  .catch((e) => {
    console.error("❌ シード処理中にエラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
