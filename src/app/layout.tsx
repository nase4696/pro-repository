import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { RedirectToaster } from "@/components/ui/redirect-toaster";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { Suspense } from "react";

const fontNotoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "React", "TailwindCSS", "shadcn/ui", "掲示板"],
  authors: [
    {
      name: "nase",
      url: siteConfig.url,
    },
  ],
  openGraph: {
    type: "website",
    locale: "ja",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    // 画像を設定できるimagesプロパティもある
  },
  twitter: {
    // twitterで共有する際の画像サイズの指定
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    // twitterで共有する際のイメージ画像はimagesでurlを指定する
    creator: "nase",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      {/* bodyにアプリ全体の背景色などを設定したい場合は、classNameが重複
      しないようにcnを使用する */}
      <body
        className={cn(
          "flex flex-col h-full bg-orange-100",
          fontNotoSansJP.className
        )}
      >
        {children}
        <Suspense fallback={null}>
          <RedirectToaster />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
