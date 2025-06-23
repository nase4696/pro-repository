"use client";

import { MessagePostAction } from "@/actions/message-actions";
import { Icons } from "@/components/icons";
import { LoadingButton } from "@/components/ui/button/loading-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSchema } from "@/lib/validations/message-schema";
import { getFormProps, getTextareaProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export function MessagePostForm({ boardId }: { boardId: string }) {
  const [lastResult, formAction, pending] = useActionState(
    MessagePostAction,
    null
  );

  const [message, setMessage] = useState("");

  const [form, fields] = useForm({
    constraint: getZodConstraint(MessageSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: MessageSchema });
    },
  });

  useEffect(() => {
    if (lastResult && lastResult.status === "error") {
      toast.error(form.errors, {
        position: "top-center",
        duration: 5000,
        style: { background: "#fa1616", color: "#fff" },
      });
    }
  }, [lastResult]);

  return (
    <form
      {...getFormProps(form)}
      action={formAction}
      className="w-full flex gap-1 items-center"
    >
      <input type="hidden" name="boardId" value={boardId} />
      <div className="flex-grow">
        <Label htmlFor={fields.message.id}></Label>
        <Textarea
          placeholder="コメントを入力"
          {...getTextareaProps(fields.message)}
          key={fields.message.key}
          className="bg-background min-h-[40px] max-h-[200px] resize-none text-xs sm:text-base"
          rows={1}
          onChange={(e) => setMessage(e.target.value)}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            const newHeight = Math.min(target.scrollHeight, 200);
            target.style.height = `${newHeight}px`;
            // 上方向にスクロールするように調整
            target.scrollTop = target.scrollHeight;
            window.scrollBy(0, -10); // 微調整
          }}
        />
        {fields.message.errors && (
          <p className="text-red-500">{fields.message.errors}</p>
        )}
      </div>
      <LoadingButton
        type="submit"
        disabled={pending || message.trim() === ""}
        className="self-end h-[40px]"
      >
        <Icons.send />
      </LoadingButton>
    </form>
  );
}
