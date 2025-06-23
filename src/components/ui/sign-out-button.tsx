"use client";

import { signOutAction } from "@/actions/registerUser";
import { Button } from "./button";

export const SignOutButton = () => {
  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={async () => {
        await signOutAction();
      }}
    >
      ログアウト
    </Button>
  );
};
