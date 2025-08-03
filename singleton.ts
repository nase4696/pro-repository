import { mockDeep } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

// 偽の司書（Prismaモック）を作成
export const prismaMock = mockDeep<PrismaClient>();
