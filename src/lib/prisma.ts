import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
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
