"use client";

import { registerSchema } from "@/lib/validations/authSchema";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useActionState } from "react";
import { registerAction } from "@/actions/registerUser";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/button/loading-button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    undefined
  );
  const searchParams = useSearchParams();
  const from = searchParams.get("redirect_to") || "/home";

  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <form {...getFormProps(form)} action={formAction} className="space-y-4">
      <input type="hidden" name="redirect_to" value={from} />
      <div>
        <Label htmlFor={fields.name.id}>ユーザーネーム</Label>
        {(() => {
          const props = getInputProps(fields.name, { type: "text" });
          const { key, ...inputProps } = props;
          return <Input key={key} {...inputProps} />;
        })()}
        {fields.name.errors && (
          <p className="text-red-500">{fields.name.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.email.id}>メールアドレス</Label>
        {(() => {
          const props = getInputProps(fields.email, { type: "email" });
          const { key, ...inputProps } = props;
          return <Input key={key} {...inputProps} />;
        })()}
        {fields.email.errors && (
          <p className="text-red-500">{fields.email.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.password.id}>パスワード</Label>
        <PasswordInput name={fields.password.name} />
        {fields.password.errors && (
          <p className="text-red-500">{fields.password.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.confirmPassword.id}>パスワード（確認用）</Label>
        <PasswordInput name={fields.confirmPassword.name} />
        {fields.confirmPassword.errors && (
          <p className="text-red-500">{fields.confirmPassword.errors}</p>
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
        isLoading={pending}
        disabled={pending}
        type="submit"
        className="w-full my-3"
      >
        新規登録
      </LoadingButton>
    </form>
  );
}
