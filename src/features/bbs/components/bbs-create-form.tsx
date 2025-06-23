"use client";

import { bbsCreateAction, bbsUpdateAction } from "@/actions/bbs-actions";
import { LoadingButton } from "@/components/ui/button/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bbsSchema } from "@/lib/validations/bbsSchema";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Board } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function BbsCreateForm({ editData }: { editData?: Board | null }) {
  const action = editData ? bbsUpdateAction : bbsCreateAction;
  const [lastResult, formAction, pending] = useActionState(action, null);

  const [form, fields] = useForm({
    constraint: getZodConstraint(bbsSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bbsSchema });
    },
    defaultValue: editData
      ? {
          title: editData.title,
          description: editData.description || "",
          content: editData.content,
        }
      : undefined,
  });

  useEffect(() => {
    if (lastResult && !editData && lastResult.status === "error") {
      toast.error("掲示板の作成に失敗しました", {
        position: "top-center",
        style: { background: "#fa1616", color: "#fff" },
      });
    } else if (lastResult && !editData && lastResult.status === "success") {
      toast.success("掲示板を作成しました", {
        position: "top-center",
        style: { background: "#30a17b", color: "#fff" },
      });
    }
  }, [lastResult]);

  return (
    <form
      {...getFormProps(form)}
      action={formAction}
      className="space-y-2 sm:space-y-4 mb-2"
    >
      <div>
        <Label htmlFor={fields.title.id}>掲示板タイトル</Label>
        <Input
          placeholder={editData ? undefined : "タイトル"}
          {...getInputProps(fields.title, { type: "text" })}
          key={fields.title.key}
          className="bg-background sm:text-sm text-xs"
        />
        {fields.title.errors && (
          <p className="text-red-500">{fields.title.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.description.id}>概要</Label>
        <Input
          placeholder={editData ? undefined : "概要を入力してください"}
          {...getInputProps(fields.description, { type: "text" })}
          key={fields.description.key}
          className="bg-background sm:text-sm text-xs"
        />
        {fields.description.errors && (
          <p className="text-red-500">{fields.description.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.content.id}>投稿内容</Label>
        <Textarea
          placeholder={editData ? undefined : "投稿内容を入力してください"}
          {...getTextareaProps(fields.content)}
          key={fields.content.key}
          className="bg-background max-h-48 min-h-[180px] text-xs sm:min-h-[120px] sm:text-sm"
          rows={1}
        />
        {fields.content.errors && (
          <p className="text-red-500">{fields.content.errors}</p>
        )}
      </div>
      {form.errors && (
        <div className="text-red-500">
          <h2>Error:</h2>
          <ul>
            {form.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <LoadingButton
        disabled={pending}
        isLoading={pending}
        type="submit"
        className="w-full sm:w-1/4 sm: my-3"
      >
        {editData ? "更新" : "作成"}
      </LoadingButton>
    </form>
  );
}
