import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";
import Link from "next/link";
import React from "react";

const NotFoundPage = async () => {
  const session = await getServerSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <Icons.notFound className="h-16 w-16 text-gray-500" />
      <h1 className="text-2xl font-bold text-center">-404エラー-</h1>
      <p className="text-lg text-center">ページが見つかりませんでした</p>
      <Button asChild variant="outline">
        {session ? (
          <Link href="/home" className="gap-2">
            ホームに戻る
          </Link>
        ) : (
          <Link href="/" className="gap-2">
            トップに戻る
          </Link>
        )}
      </Button>
    </div>
  );
};

export default NotFoundPage;
