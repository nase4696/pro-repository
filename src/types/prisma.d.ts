import { Board, Message as PrismaMessage } from "@prisma/client";

export type MessageWithAuthor = PrismaMessage & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type BoardWithCreator = Board & {
  creator: {
    name: string | null;
    id: string;
  };
};
