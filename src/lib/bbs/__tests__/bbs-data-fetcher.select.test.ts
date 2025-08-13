import { prisma } from "@/lib/prisma";
import {
  vi,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest"; // 変更

const { sessionMock, redirectMock } = vi.hoisted(() => ({
  sessionMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

import { faker } from "@faker-js/faker";
import { fetchSelectBbs } from "@/lib/bbs/bbs-data-fetcher";
import { Board, User } from "@prisma/client";

vi.mock("@/lib/session", () => ({
  getServerSession: sessionMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const createTestUser = () => {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    },
  });
};

const createTestBoard = (creatorId: string) => {
  return prisma.board.create({
    data: {
      title: faker.lorem.words(3),
      content: faker.lorem.paragraphs(2),
      description: faker.lorem.sentence(),
      creatorId,
    },
  });
};

describe("fetchSelectBbs", () => {
  // 全テストで共有するデータ
  let testUser: User;

  // beforeAll: 全テスト共通の初期化
  beforeAll(async () => {
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();

    testUser = await createTestUser(); // 全テストで使うユーザー
  });

  // beforeEach: テストごとの初期化
  let testBoard: Board;
  beforeEach(async () => {
    testBoard = await createTestBoard(testUser.id); // 各テスト専用掲示板
  });

  // afterAll: 後片付け
  afterAll(async () => {
    const deleteBoard = prisma.board.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([deleteBoard, deleteUser]);

    await prisma.$disconnect();
  });

  test("正しい掲示板IDで詳細情報取得", async () => {
    const result = await fetchSelectBbs(testBoard.id);
    expect(result?.title).toBe(testBoard.title);
  });

  test("存在しない掲示板IDでnullが返される", async () => {
    const result = await fetchSelectBbs("invalid.id");
    expect(result).toBeNull();
  });

  test("未ログイン時はログインページにリダイレクト", async () => {
    sessionMock.mockResolvedValue(null);
    await fetchSelectBbs(testBoard.id);
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
});
