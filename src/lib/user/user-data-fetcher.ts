import "server-only";

import { User } from "@prisma/client";
import { prisma } from "../prisma";

function UserDTO(user: User) {
  return {
    name: user.name,
    id: user.id,
    email: user.email,
    image: user.image,
  };
}

export async function UserCreate(
  data: {
    name: string;
    email: string;
  },
  hashedPassword: string
) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return UserDTO(user);
}
