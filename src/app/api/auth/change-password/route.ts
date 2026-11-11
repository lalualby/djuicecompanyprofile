import { NextResponse } from "next/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { getRecords, updateRecord } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid. Silakan login." }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Kata sandi lama dan baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const users = await getRecords("Users");
    const currentUserData = users.find((u: any) => u.id === user.id);

    if (!currentUserData) {
      return NextResponse.json({ error: "Data pengguna tidak ditemukan." }, { status: 404 });
    }

    const isMatch = await verifyPassword(oldPassword, currentUserData.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Kata sandi lama Anda salah." }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await updateRecord("Users", user.id, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal mengubah kata sandi: ${err.message}` },
      { status: 500 }
    );
  }
}

