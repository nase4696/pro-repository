import { NextResponse } from "next/server.js";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

export const { auth } = NextAuth(authConfig);

// bbsを含むURL全てを一括で指定することは出来ないのか？
const protectedPaths = ["/home", "/bbs"];

export default auth(async function middleware(req) {
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-url", req.url);

  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }

  // 保護対象かチェック（「/home」または「/bbs」で始まるパス）
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_to", pathname + req.nextUrl.search);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // リダイレクトレスポンスにもヘッダーを追加
    redirectResponse.headers.set("x-url", req.url);
    return redirectResponse;
  }

  // 通常のレスポンス（ヘッダー付き）
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
