import { NextResponse } from "next/server";
import { getRecords } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = await getRecords("News");
    const published = news
      .filter((n: any) => n.status === "published")
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: published,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal memuat berita: ${err.message}` },
      { status: 500 }
    );
  }
}

