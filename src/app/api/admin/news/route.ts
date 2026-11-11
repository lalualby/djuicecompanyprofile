import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRecords, insertRecord, updateRecord, deleteRecord } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const news = await getRecords("News");
    const sorted = news.sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, data: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { title, excerpt, content, thumbnail_path, status } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newArticle = await insertRecord("News", {
      title,
      slug: `${slug}-${Date.now().toString(36)}`,
      excerpt: excerpt || content.substring(0, 140) + "...",
      content,
      thumbnail_path: thumbnail_path || "/images/about-fruits.png",
      status: status === "published" ? "published" : "draft",
      author_id: user.id,
    });

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { id, title, excerpt, content, thumbnail_path, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID berita wajib disertakan." }, { status: 400 });
    }

    const updatePayload: any = {};
    if (title !== undefined) {
      updatePayload.title = title;
      updatePayload.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    if (excerpt !== undefined) updatePayload.excerpt = excerpt;
    if (content !== undefined) updatePayload.content = content;
    if (thumbnail_path !== undefined) updatePayload.thumbnail_path = thumbnail_path;
    if (status !== undefined) updatePayload.status = status;

    const updated = await updateRecord("News", id, updatePayload);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID berita wajib disertakan." }, { status: 400 });
    }

    // Ambil berita untuk membersihkan file upload jika ada
    const newsList = await getRecords("News");
    const article = newsList.find((n: any) => n.id === id);
    if (article && article.thumbnail_path && article.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(article.thumbnail_path);
    }

    await deleteRecord("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

