import { NextResponse } from "next/server";
import { getRecords } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const users = await getRecords("Users");
    const user = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Akun Anda dinonaktifkan. Hubungi admin." },
        { status: 403 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    // Ambil data role
    const roles = await getRecords("Roles");
    const roleObj = roles.find((r: any) => r.id === user.role_id || r.name === user.role_id);
    const roleName = roleObj ? roleObj.name : "user";

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
    };

    const token = await signSession(sessionUser);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Terjadi kesalahan server: ${err.message}` },
      { status: 500 }
    );
  }
}

