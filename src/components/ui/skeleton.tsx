import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

export function BbsListSkeleton() {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border-8 border-muted bg-white text-center sm:text-lef h-40 sm:h-[136px] md:h-40 flex flex-col justify-center"
        >
          <div className="flex flex-col items-center sm:items-start space-y-1.5 p-6">
            <Skeleton className="h-7 w-3/4 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="mt-auto p-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EditorBbsListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex gap-1 sm:gap-2 h-[57px] sm:h-[60px] flex-col sm:flex-row border-4 border-muted items-center bg-white p-1 sm:p-2 rounded-md"
        >
          <div className="flex-1 flex gap-2 justify-between items-center w-full rounded-md px-1 py-2 sm:p-2">
            <Skeleton className="flex-1 h-4 sm:h-11" />
            <div className="sm:hidden">
              <Skeleton className="h-6 w-7" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="sm:h-11 sm:w-[72px] pr-1" />
            <Skeleton className="sm:h-11 sm:w-[72px] pr-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BbsMainContentSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-0 gap-2 justify-center items-center">
      {/* アコーディオン */}
      <div className="bg-white h-[49px] sm:h-[53px] w-full p-2 flex justify-center items-center">
        <Skeleton className="h-4 sm:h-5 w-full" />
      </div>
      {/* メッセージリスト */}
      <div className="flex-1 bg-white mb-[55px] max-h-[calc(100vh-202px)] sm:max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-225px)] w-full overflow-y-auto shadow-md rounded-md p-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-spacing-2 rounded-md p-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-[49px] sm:w-[57px]" />
              </div>
              <Skeleton className="h-5 w-[105px] sm:w-[120px]" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
      {/* メッセージ送信フォーム */}
      <div className="w-full fixed bottom-0 left-1/2 -translate-x-1/2 z-10 mb-2">
        <div className="sm:max-w-[38rem] md:max-w-[42rem] lg:max-w-[56rem] mx-auto px-2">
          <div className="w-full bg-white rounded-lg flex items-center">
            {/* テキストエリア部分 */}
            <div className="flex-grow">
              <Skeleton className="h-10 rounded-lg border-4 border-white" />
            </div>

            {/* 送信ボタン部分 */}
            <Skeleton className="h-10 w-10 rounded-lg border-4 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MainNavSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between sm:items-center mx-auto mb-2 sm:mb-4">
      {/* モバイル用メニューボタン */}
      <div className="sm:hidden flex">
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>

      {/* タイトル部分 */}
      <Skeleton className="h-6 w-32" />

      {/* デスクトップ用ナビゲーション */}
      <nav className="hidden sm:flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
        <Skeleton className="h-8 w-10 rounded-md" />
      </nav>
    </div>
  );
}

export function OAuthSignInSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function RegisterFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function SignInFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
