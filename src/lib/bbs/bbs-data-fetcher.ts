import "server-only";
import { Board, Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { cache } from "react";
import { getServerSession } from "../session";
import { redirect } from "next/navigation";
import { BoardWithCreator } from "@/types/prisma";

function fetchBoardsDTO(board: BoardWithCreator) {
  return {
    id: board.id,
    title: board.title,
    description: board.description || null,
    createdAt: board.createdAt,
    creator: {
      name: board.creator.name,
    },
  };
}

export const fetchBoards = cache(
  async (options?: {
    userId?: string;
    page?: number;
    perPage?: number;
    sort?: string;
  }) => {
    const session = await getServerSession();

    if (!session) {
      redirect("/login");
    }

    const page = options?.page || 1;
    const perPage = options?.perPage || 8;

    const orderBy: Prisma.BoardOrderByWithRelationInput =
      options?.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const [rawPosts, totalItems] = await Promise.all([
      prisma.board.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where: options?.userId ? { creatorId: options.userId } : {},
        include: { creator: true },
        orderBy,
      }),
      prisma.board.count(),
    ]);

    const data = rawPosts.map(fetchBoardsDTO);

    return { data, totalItems };
  }
);

function SelectBbsDTO(
  board: Prisma.BoardGetPayload<{
    include: {
      creator: true;
      messages: { include: { author: true } };
    };
  }>
) {
  return {
    title: board.title,
    content: board.content,
    creatorId: board.creatorId,
    id: board.id,
    createdAt: board.createdAt,
    description: board.description,
    creator: {
      name: board.creator.name,
      id: board.creator.id,
    },
    messages: board.messages.map((message) => ({
      id: message.id,
      createdAt: message.createdAt,
      content: message.content,
      author: {
        id: message.author.id,
        image: message.author.image,
        name: message.author.name,
      },
    })),
  };
}

export async function fetchSelectBbs(bbsId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const board = await prisma.board.findUnique({
    where: { id: bbsId },
    include: {
      creator: true,
      messages: { include: { author: true } },
    },
  });

  return board ? SelectBbsDTO(board) : null;
}

function BbsDTO(board: Board) {
  return {
    id: board.id,
    title: board.title,
    description: board.description,
    content: board.content,
    creatorId: board.creatorId,
    createdAt: board.createdAt,
  };
}

export async function BbsUpdate(
  id: string,
  data: { title: string; description: string; content: string }
) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const board = await prisma.board.update({
    where: {
      id,
      creatorId: session.user?.id,
    },
    data: {
      title: data?.title,
      description: data?.description,
      content: data?.content,
    },
  });

  return BbsDTO(board);
}

export async function BbsCreate(data: {
  title: string;
  description: string;
  content: string;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const board = await prisma.board.create({
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      creatorId: session.user!.id,
    },
  });

  return BbsDTO(board);
}

export async function BbsDelete(postId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return await prisma.board.delete({
    where: {
      id: postId,
    },
  });
}
