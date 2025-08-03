"use client";

import { useRouter, useSearchParams } from "next/navigation.js";
import { useEffect } from "react";
import { toast } from "sonner";
import { Icons } from "../icons";

export function RedirectToaster() {
  const searchParams = useSearchParams();
  const toastCode = searchParams.get("toast_code");
  const redirectTo = searchParams.get("redirect_to");
  const router = useRouter();

  useEffect(() => {
    // toastCodeが存在しない場合は、returnするようにしないと他のページにアクセスしても"/home"に遷移させられる
    if (!toastCode) return;

    switch (toastCode) {
      case "register_success":
        toast("新規登録が完了しました", {
          icon: <Icons.success className="w-4 h-4" />,
          duration: 5000,
          position: "top-center",
          style: { background: "#30a17b", color: "#fff" },
        });
        break;
      case "login_success":
        toast("ログインしました", {
          icon: <Icons.success className="w-4 h-4" />,
          duration: 5000,
          position: "top-center",
          style: { background: "#30a17b", color: "#fff" },
        });
        break;
      case "signout_success":
        toast("サインアウトしました", {
          icon: <Icons.success className="w-4 h-4" />,
          duration: 5000,
          position: "top-center",
          style: { background: "#3b82f6", color: "#fff" },
        });
        break;
      case "edit_success":
        toast("掲示板を更新しました", {
          icon: <Icons.success className="w-4 h-4" />,
          duration: 5000,
          position: "top-center",
          style: { background: "#30a17b", color: "#fff" },
        });
        break;
    }

    let targetPath = "/home";

    // 安全チェック付きリダイレクト処理
    if (redirectTo) {
      // 不正なパスを防ぐチェック（例：外部サイトへのリダイレクト防止）
      const isValidPath =
        redirectTo.startsWith("/") && !redirectTo.includes("//");
      targetPath = isValidPath ? redirectTo : "/home";
    }

    router.replace(targetPath);
  }, [toastCode, router]);

  return null;
}
