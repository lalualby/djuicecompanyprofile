import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRecords, insertRecord, deleteRecord } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const roles = await getRecords("Roles");
    return NextResponse.json({ success: true, data: roles });
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

    const { name, description, permissions } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama role wajib diisi." }, { status: 400 });
    }

    const safeName = name.toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const roles = await getRecords("Roles");
    if (roles.some((r: any) => r.name.toLowerCase() === safeName)) {
      return NextResponse.json({ error: "Nama role sudah ada." }, { status: 409 });
    }

    const newRole = await insertRecord("Roles", {
      id: `role-${safeName}`,
      name: safeName,
      description: description || `Role ${safeName}`,
      permissions: permissions || "read",
      is_system: "false",
    });

    return NextResponse.json({ success: true, data: newRole }, { status: 201 });
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
      return NextResponse.json({ error: "ID role wajib disertakan." }, { status: 400 });
    }

    const roles = await getRecords("Roles");
    const role = roles.find((r: any) => r.id === id);

    if (role && (role.is_system === "true" || role.is_system === true)) {
      return NextResponse.json(
        { error: "Role sistem bawaan tidak dapat dihapus." },
        { status: 400 }
      );
    }

    await deleteRecord("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

