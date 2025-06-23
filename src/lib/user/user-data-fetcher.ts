import "server-only";

import { User } from "@prisma/client";
import { prisma } from "../prisma";

// userを作成する処理だが、passwordを返さないようにする方法はあるのか？また、する必要があるのか？
// 作成処理でpasswordを含めなかったらどうなるのか確認する

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
