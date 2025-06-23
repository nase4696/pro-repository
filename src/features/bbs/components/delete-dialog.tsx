"use client";

import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BbsDeleteButton } from "./bbs-delete-button";

type DeleteDialogProps = {
  type: "bbs" | "message";
  targetId: string;
};

export function DeleteDialog({ type, targetId }: DeleteDialogProps) {
  const descriptionText = {
    bbs: "掲示板の内容は失われてしまいます",
    message: "コメントの内容は失われてしまいます",
  };
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="flex w-full sm:h-11 items-center justify-center sm:gap-1 sm:bg-white sm:border-2 hover:bg-accent sm:rounded-md sm:p-2"
      >
        <Button
          variant="ghost"
          className="w-full text-sm sm:text-base"
          onClick={(e) => e.stopPropagation()}
        >
          {type === "bbs" && (
            <Icons.delete className="hidden sm:flex sm:h-5 sm:w-5" />
          )}
          削除
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>本当に削除しますか？</DialogTitle>
          <DialogDescription>{descriptionText[type]}</DialogDescription>
          <DialogClose asChild className="flex gap-2 justify-center">
            <div>
              <BbsDeleteButton type={type} targetId={targetId} />
              <Button variant="secondary">いいえ</Button>
            </div>
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
