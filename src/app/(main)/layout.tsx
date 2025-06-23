import { MainHeader } from "@/components/layout/main-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className="flex-1 pt-1 sm:pt-2 bg-orange-100">
        <div className="h-full sm:max-w-[38rem] md:max-w-[42rem] lg:max-w-[56rem] mx-auto px-2">
          {children}
        </div>
      </main>
    </>
  );
}
