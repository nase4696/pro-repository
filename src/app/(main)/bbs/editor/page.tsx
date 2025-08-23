import MainNav from "@/components/layout/main-nav";
import { mainNavConfig } from "@/config/navigation";
import { EditorBbsList } from "@/components/component/editor-bbs-list";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  EditorBbsListSkeleton,
  MainNavSkeleton,
} from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "掲示板の編集",
};

export default async function EditorPage() {
  return (
    <>
      <Suspense fallback={<MainNavSkeleton />}>
        <MainNav items={mainNavConfig.mainNav}>掲示板の編集</MainNav>
      </Suspense>
      <Suspense fallback={<EditorBbsListSkeleton />}>
        <EditorBbsList />
      </Suspense>
    </>
  );
}
