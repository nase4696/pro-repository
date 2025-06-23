import { BbsCreateForm } from "@/features/bbs/components/bbs-create-form";
import { fetchSelectBbs } from "@/lib/bbs/bbs-data-fetcher";
import { getServerSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { editorId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { editorId } = await params;
  const post = await fetchSelectBbs(editorId);

  return {
    title: `${post?.title}の編集`,
    description: post?.content.substring(0, 100) + "...",
  };
}

export default async function BbsEditorPage({ params }: Props) {
  const { editorId } = await params;

  const session = await getServerSession();

  const board = await fetchSelectBbs(editorId);

  if (!board || board.creatorId !== session?.user?.id) {
    redirect("/bbs/editor");
  }

  return (
    <div className="container space-y-6 sm:space-y-8 pb-2">
      <div className="space-y-4 md:space-y-12 mt-1">
        <Link
          href="/bbs/editor"
          className="max-w-fit hover:bg-orange-50 mb-1 rounded-md p-2 text-xs sm:text-sm font-semibold"
        >
          編集一覧に戻る
        </Link>
        <h3 className="underline text-xl text-center sm:text-left">
          掲示板編集
        </h3>
      </div>

      <BbsCreateForm editData={board} />
    </div>
  );
}
