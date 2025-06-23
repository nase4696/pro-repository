import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { fetchBoards } from "@/lib/bbs/bbs-data-fetcher";
import { TablePagination } from "../ui/pagination";
import { SortSelector } from "./sort-selector";
import { Suspense } from "react";
import { BbsListSkeleton } from "../ui/skeleton";

type BbsListProps = {
  currentPage: number;
  rootUrl: string;
  sort?: string;
};

export default async function BbsList({
  currentPage,
  rootUrl,
  sort,
}: BbsListProps) {
  const perPage = 6;
  return (
    <div>
      <SortSelector />
      <Suspense fallback={<BbsListSkeleton />}>
        <PostsContent
          currentPage={currentPage}
          perPage={perPage}
          rootUrl={rootUrl}
          sort={sort}
        />
      </Suspense>
    </div>
  );
}

async function PostsContent({
  currentPage,
  perPage,
  rootUrl,
  sort,
}: BbsListProps & { perPage: number }) {
  const { data: posts, totalItems } = await fetchBoards({
    page: currentPage,
    perPage,
    sort,
  });

  // console.log("posts:", posts);

  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <>
      <div className="grid gap-2 md:grid-cols-2">
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/bbs/${post.id}`}>
              <Card className="text-center sm:text-left md:h-40 flex flex-col justify-center">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col sm:flex-row sm:justify-between text-xs sm:text-sm">
                  <p>{post.creator?.name ?? "不明"}</p>
                  <p>{post.createdAt.toLocaleString()}</p>
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      <TablePagination
        totalPages={totalPages}
        currentPage={currentPage}
        rootUrl={rootUrl}
        sort={sort}
      />
    </>
  );
}
