import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRecords, updateRecord, deleteRecord } from "@/lib/db";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const [users, roles] = await Promise.all([
      getRecords("Users"),
      getRecords("Roles"),
    ]);

    const sanitized = users.map((u: any) => {
      const roleObj = roles.find((r: any) => r.id === u.role_id || r.name === u.role_id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role_id: u.role_id,
        role_name: roleObj ? roleObj.name : "user",
        status: u.status,
        created_at: u.created_at,
        updated_at: u.updated_at,
      };
    });

    return NextResponse.json({ success: true, data: sanitized });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { id, role_id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    const users = await getRecords("Users");
    const targetUser = users.find((u: any) => u.id === id);

    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Larangan: Admin tidak boleh menonaktifkan dirinya sendiri
    if (targetUser.id === currentUser.id && status === "inactive") {
      return NextResponse.json(
        { error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    // Larangan: Jangan ubah role admin terakhir menjadi user
    if (
      targetUser.role_id === "role-admin" &&
      role_id &&
      role_id !== "role-admin"
    ) {
      const adminCount = users.filter((u: any) => u.role_id === "role-admin").length;
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Tidak dapat mengubah role admin terakhir dalam sistem." },
          { status: 400 }
        );
      }
    }

    const updatePayload: any = {};
    if (role_id !== undefined) updatePayload.role_id = role_id;
    if (status !== undefined) updatePayload.status = status;

    const updated = await updateRecord("Users", id, updatePayload);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    // Larangan: Admin tidak bisa menghapus dirinya sendiri
    if (id === currentUser.id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif." },
        { status: 400 }
      );
    }

    const users = await getRecords("Users");
    const targetUser = users.find((u: any) => u.id === id);

    if (targetUser && targetUser.role_id === "role-admin") {
      const adminCount = users.filter((u: any) => u.role_id === "role-admin").length;
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Tidak dapat menghapus admin terakhir dalam sistem." },
          { status: 400 }
        );
      }
    }

    await deleteRecord("Users", id);
    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

