import Header from "@/components/layout/Header";
import { MainStyle } from "@/components/layout/main-style";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainStyle>{children}</MainStyle>
    </div>
  );
}
