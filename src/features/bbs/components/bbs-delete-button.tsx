"use client";

import { bbsDeleteAction } from "@/actions/bbs-actions";
import { messageDeleteAction } from "@/actions/message-actions";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation.js";
import { toast } from "sonner";

type BbsDeleteButtonProps = {
  type: "bbs" | "message";
  targetId: string;
};

export function BbsDeleteButton({ type, targetId }: BbsDeleteButtonProps) {
  const router = useRouter();
  const params = useParams();
  const bbsId = params.bbsId as string;

  const handleDelete = async () => {
    try {
      let result;
      if (type === "bbs") {
        result = await bbsDeleteAction(targetId);
      } else {
        result = await messageDeleteAction(targetId, bbsId);
      }
      if (result?.error) {
        toast.error(result.error, {
          duration: 5000,
          position: "top-center",
          style: { background: "#fa1616", color: "#fff" },
        });
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error("削除処理に失敗しました", {
        duration: 5000,
        position: "top-center",
        style: { background: "#fa1616", color: "#fff" },
      });
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      はい
    </Button>
  );
}
