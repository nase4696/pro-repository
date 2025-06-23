export function MainStyle({ children }: { children: React.ReactNode }) {
  return (
    // 後でoverflow-hiddenを入れる
    <main className="flex-1 pt-1 sm:pt-4 bg-orange-100">
      <div className="h-full sm:max-w-[38rem] md:max-w-[42rem] lg:max-w-[56rem] mx-auto px-2">
        {children}
      </div>
    </main>
  );
}
