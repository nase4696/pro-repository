import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Top() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-0 sm:pt-20">
      <h1 className="text-3xl sm:text-5xl pt-8 font-semibold text-center">
        ようこそ、掲示板を通じて周りのユーザーと繋がろう
      </h1>
      <p className="text-sm md:text-lg sm:max-w-[30rem] md:max-w-[35rem] lg:max-w-[45rem] text-center py-8 md:py-12">
        このアプリケーションでは掲示板の閲覧、コメント投稿、掲示板の作成をすることが可能で、自分にあった掲示板を通じて他のユーザー同士でコミュニケーションをとることができます。
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-1">
        <Button variant="blue" asChild>
          <Link href="/login">ログイン</Link>
        </Button>
        <Button variant="green" asChild>
          <Link href="/register">新規登録</Link>
        </Button>
      </div>
    </div>
  );
}
