import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 環境判別ロジックを追加
const getDatabaseUrl = () => {
  // テスト環境の場合
  if (process.env.NODE_ENV === "test") {
    console.log("テスト環境用DBを使用:", process.env.DATABASE_URL);
    return process.env.DATABASE_URL; // テスト専用DB
  }

  // 開発環境 or 本番環境の場合
  console.log("開発/本番環境用DBを使用");
  return process.env.DATABASE_URL; // メインDB
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: getDatabaseUrl(), // 環境に応じたURLを使用
      },
    },
    omit: {
      user: {
        password: true, // パスワードを常に除外
      },
      account: {
        refresh_token: true,
        access_token: true,
        id_token: true,
      },
      verificationRequest: {
        token: true,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
