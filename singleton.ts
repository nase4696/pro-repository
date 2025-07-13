import { mock } from "bun:test";
import { createPrismaMock } from "bun-mock-prisma";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma"; // 本物のPrisma
import type { PrismaClientMock } from "bun-mock-prisma";

// 偽の司書を配置
mock.module("@/lib/prisma", () => ({
  __esModule: true,
  prisma: createPrismaMock<PrismaClient>(), // プロの偽物司書
}));

// テストで使えるようにエクスポート
export const prismaMock = prisma as unknown as PrismaClientMock<PrismaClient>;
