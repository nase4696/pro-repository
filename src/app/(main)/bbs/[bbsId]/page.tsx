import { BbsMainContent } from "@/components/component/bbs-main-content";
import { BbsMainContentSkeleton } from "@/components/ui/skeleton";
import { fetchSelectBbs } from "@/lib/bbs/bbs-data-fetcher";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

type BbsIdProps = {
  params: Promise<{ bbsId: string }>;
};

export async function generateMetadata({
  params,
}: BbsIdProps): Promise<Metadata> {
  const { bbsId } = await params;

  const post = await fetchSelectBbs(bbsId);

  return {
    title: `${post?.title}`,
    description: post?.content.substring(0, 100) + "...",
  };
}

export default async function BbsPage({ params }: BbsIdProps) {
  const { bbsId } = await params;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Link
        href="/home"
        className="max-w-fit hover:bg-orange-50 mb-1 rounded-md p-2 text-xs sm:text-sm font-semibold"
      >
        ホームに戻る
      </Link>
      <Suspense fallback={<BbsMainContentSkeleton />}>
        <BbsMainContent bbsId={bbsId} />
      </Suspense>
    </div>
  );
}
