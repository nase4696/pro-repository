import MainNav from "@/components/layout/main-nav";
import { mainNavConfig } from "@/config/navigation";
import { BbsCreateForm } from "@/features/bbs/components/bbs-create-form";
import { Metadata } from "next";
import { Suspense } from "react";
import { MainNavSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "掲示板の作成",
};

export default function BbsCreate() {
  return (
    <div className="container space-y-6 sm:space-y-8 pb-2">
      <div className="space-y-4 md:space-y-12">
        <div>
          <Suspense fallback={<MainNavSkeleton />}>
            <MainNav items={mainNavConfig.mainNav}>
              <h3>掲示板の作成</h3>
            </MainNav>
          </Suspense>
        </div>
      </div>

      <BbsCreateForm />
    </div>
  );
}
