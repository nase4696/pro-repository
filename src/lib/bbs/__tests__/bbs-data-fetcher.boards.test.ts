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
import { fetchBoards } from "@/lib/bbs/bbs-data-fetcher";
import { User } from "@prisma/client";

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

const createTestBoard = (creatorId: string, title?: string) => {
  return prisma.board.create({
    data: {
      title: title || faker.lorem.words(3),
      content: faker.lorem.paragraphs(2),
      description: faker.lorem.sentence(),
      creatorId,
    },
  });
};

describe("fetchBoards", () => {
  // 全テストで共有するデータ
  let testUser: User;
  let otherUser: User;

  // beforeAll: 全テスト共通の初期化
  beforeAll(async () => {
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();

    testUser = await createTestUser();
    otherUser = await createTestUser();

    // テスト用掲示板作成（20件）
    for (let i = 0; i < 20; i++) {
      await createTestBoard(
        i < 15 ? testUser.id : otherUser.id,
        `掲示板${i + 1}`
      );
    }
  });

  // afterAll: 後片付け
  afterAll(async () => {
    const deleteBoard = prisma.board.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([deleteBoard, deleteUser]);

    await prisma.$disconnect();
  });

  test("デフォルト設定で掲示板一覧を取得", async () => {
    const result = await fetchBoards();

    // デフォルトのperPage=8件であることを確認
    expect(result.data.length).toBe(8);

    // 最新順ソートの確認（最後に作成した掲示板が先頭）
    expect(result.data[0].title).toBe("掲示板20");

    expect(result.totalItems).toBe(20);
  });

  test("未ログインの場合はログインページにリダイレクト", async () => {
    sessionMock.mockResolvedValue(null);
    await fetchBoards();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  test("2ページ目の内容を取得", async () => {
    const result = await fetchBoards({ page: 2 });
    expect(result.data.length).toBe(8);
    expect(result.data[0].title).toBe("掲示板12");
  });

  test("古い順で表示件数を5件で表示", async () => {
    const result = await fetchBoards({ perPage: 5, sort: "oldest" });
    expect(result.data.length).toBe(5);
    expect(result.data[0].title).toBe("掲示板1");
  });

  test("特定のユーザーの掲示板のみ表示", async () => {
    const result = await fetchBoards({ userId: otherUser.id });
    expect(result.data.length).toBe(5);
    result.data.forEach((board) => {
      expect(board.creator.name).toBe(otherUser.name);
    });
  });

  test("存在しないページは表示されない", async () => {
    const result = await fetchBoards({ page: 100 });
    expect(result.data.length).toBe(0);
  });
});
