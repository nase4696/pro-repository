// app/api/test-connection/route.ts というファイルを作成
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // データベースに簡単なクエリを送信（健康診断のようなもの）
    const result = await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      message: "🎉 データベース接続成功！",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // エラーが発生した場合の詳細な情報
    console.error("データベース接続エラー:", error);

    // エラーメッセージを安全に取得
    let errorMessage = "詳細はサーバーログを確認してください";

    // errorがErrorオブジェクトかどうかを確認
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        success: false,
        message: "❌ データベース接続に失敗しました",
        error:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : "詳細はサーバーログを確認してください",
      },
      { status: 500 }
    );
  }
}
