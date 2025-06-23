import "server-only";

import { Message } from "@prisma/client";
import { getServerSession } from "../session";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

function MessageDTO(msg: Message) {
  return {
    id: msg.id,
    content: msg.content,
    authorId: msg.authorId,
    boardId: msg.boardId,
    createdAt: msg.createdAt,
  };
}

export async function getMessage(messageId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const msg = await prisma.message.findUnique({
    where: { id: messageId },
  });

  return msg ? MessageDTO(msg) : null;
}

export async function MessageCreate(message: string, boardId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const msg = await prisma.message.create({
    data: {
      content: message,
      authorId: session.user!.id,
      boardId,
    },
  });

  return MessageDTO(msg);
}

export async function MessageDelete(messageId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return await prisma.message.delete({
    where: {
      id: messageId,
    },
  });
}
