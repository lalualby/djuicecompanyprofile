import { NextResponse } from "next/server";
import { getRecords, insertRecord } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const users = await getRecords("Users");
    const existing = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    // Role selalu 'role-user' / 'user'
    const passwordHash = await hashPassword(password);
    const newUser: any = await insertRecord("Users", {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      role_id: "role-user",
      status: "active",
    });

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "user",
    };

    const token = await signSession(sessionUser);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Terjadi kesalahan pendaftaran: ${err.message}` },
      { status: 500 }
    );
  }
}
