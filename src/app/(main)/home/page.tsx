import BbsList from "@/components/component/bbs-list";
import MainNav from "@/components/layout/main-nav";
import { mainNavConfig } from "@/config/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string };
}) {
  const { page, sort } = await searchParams;

  const currentPage = Number(page) || 1;
  const rootUrl = "/home";

  return (
    <div>
      <MainNav items={mainNavConfig.mainNav}>掲示板一覧</MainNav>
      <div className="mb-2">
        <BbsList currentPage={currentPage} rootUrl={rootUrl} sort={sort} />
      </div>
    </div>
  );
}
