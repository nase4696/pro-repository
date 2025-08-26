import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // データベースに接続試行
    await prisma.$connect();

    // 簡単なクエリを実行
    const result = await prisma.$queryRaw`SELECT 1`;

    // 接続を閉じる
    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: "🎉 データベース接続成功！",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("データベース接続エラー:", error);

    // 詳細なエラーメッセージを取得
    let errorMessage = "不明なエラー";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // 環境変数の情報（マスク済み）
    const dbUrl = process.env.DATABASE_URL;
    const maskedDbUrl = dbUrl ? dbUrl.replace(/:[^:]*@/, ":****@") : "未設定";

    return NextResponse.json(
      {
        success: false,
        message: "❌ データベース接続に失敗しました",
        error: errorMessage,
        environment: process.env.NODE_ENV,
        database: {
          configured: !!dbUrl,
          url: maskedDbUrl,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
