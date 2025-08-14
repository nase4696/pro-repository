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
// const { BbsCreate, BbsUpdate, BbsDelete } = await import(
//   "@/lib/bbs/bbs-data-fetcher"
// );
import { BbsCreate, BbsUpdate, BbsDelete } from "@/lib/bbs/bbs-data-fetcher";
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

// 全テストで共有するデータ
let testUser: User;
let otherUser: User;

let testBoard: Board;

// beforeAll: 全テスト共通の初期化
beforeAll(async () => {
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  testUser = await createTestUser();
  otherUser = await createTestUser();

  testBoard = await createTestBoard(testUser.id);
});

beforeEach(() => {
  sessionMock.mockReset();
  sessionMock.mockResolvedValue({
    user: {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
    },
  });

  redirectMock.mockImplementation(() => {
    throw new Error("REDIRECT_TO_LOGIN");
  });
});

// afterAll: 後片付け
afterAll(async () => {
  const deleteBoard = prisma.board.deleteMany();
  const deleteUser = prisma.user.deleteMany();

  await prisma.$transaction([deleteBoard, deleteUser]);

  await prisma.$disconnect();
});

describe("BbsCreate", () => {
  const validData = {
    title: faker.lorem.words(3),
    content: faker.lorem.paragraphs(2),
    description: faker.lorem.sentence(),
  };

  test("掲示板を新規作成できる", async () => {
    const result = await BbsCreate(validData);
    expect(result.title).toBe(validData.title);
    expect(result.creatorId).toBe(testUser.id);

    // データベースに実際に存在するか確認
    const dbBoard = await prisma.board.findUnique({
      where: { id: result.id },
    });
    expect(dbBoard).not.toBeNull();
  });

  test("未ログイン時はログインページにリダイレクト", async () => {
    sessionMock.mockResolvedValue(null);
    await expect(BbsCreate(validData)).rejects.toThrow("REDIRECT_TO_LOGIN");
  });
});

describe("BbsUpdate", () => {
  const updateData = {
    title: "更新タイトル",
    content: "更新内容",
    description: "更新説明",
  };

  test("自分の投稿を更新できる", async () => {
    const result = await BbsUpdate(testBoard.id, updateData);
    expect(result.title).toBe("更新タイトル");
  });

  test("未ログイン時はログインページにリダイレクト", async () => {
    sessionMock.mockResolvedValue(null);
    await expect(BbsCreate(updateData)).rejects.toThrow("REDIRECT_TO_LOGIN");
  });

  test("他人の投稿は更新できない", async () => {
    sessionMock.mockResolvedValueOnce({ user: { id: otherUser.id } });
    await expect(BbsUpdate(testBoard.id, updateData)).rejects.toThrow(
      "投稿が見つからないか権限がありません"
    );
  });
});

describe("BbsDelete", () => {
  test("掲示板を正常に削除できる", async () => {
    await BbsDelete(testBoard.id);
    const result = await prisma.board.findUnique({
      where: { id: testBoard.id },
    });
    expect(result).toBeNull();
  });

  test("他人の投稿は削除できない", async () => {
    sessionMock.mockResolvedValueOnce({
      user: {
        id: otherUser.id,
        name: otherUser.name,
        email: otherUser.email,
      },
    });

    await expect(BbsDelete(testBoard.id)).rejects.toThrow(
      "投稿が見つからないか権限がありません"
    );
  });
});
