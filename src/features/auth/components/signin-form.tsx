"use client";

import { loginSchema } from "@/lib/validations/authSchema";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/button/loading-button";
import { useSigninLogic } from "../hooks/use-signin-logic";

export function SignInForm() {
  const { from, pending, state, formAction } = useSigninLogic();

  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <form {...getFormProps(form)} action={formAction} className="space-y-4">
      <input type="hidden" name="redirect_to" value={from} />
      <div>
        <Label htmlFor={fields.email.id}>メールアドレス</Label>
        {(() => {
          const props = getInputProps(fields.email, { type: "email" });
          const { key, ...inputProps } = props;
          return <Input key={key} {...inputProps} />;
        })()}
        {fields.email.errors && (
          <p className="text-red-700">{fields.email.errors}</p>
        )}
      </div>
      <div>
        <Label htmlFor={fields.password.id}>パスワード</Label>
        <PasswordInput name={fields.password.name} id={fields.password.id} />
        {fields.password.errors && (
          <p className="text-red-700">{fields.password.errors}</p>
        )}
      </div>
      {form.errors && (
        <div className="text-red-700" data-testid="error-container">
          <h2>Error:</h2>
          <ul>
            {form.errors.map((error) => (
              <li key={error} role="alert">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoadingButton
        data-testid="login-button"
        isLoading={pending}
        disabled={pending}
        type="submit"
        className="w-full my-3"
      >
        ログイン
      </LoadingButton>
    </form>
  );
}
