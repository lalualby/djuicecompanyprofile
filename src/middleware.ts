import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "djuice_super_secret_session_jwt_key_32chars_min"
);

const COOKIE_NAME = "djuice_session";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Cek akses ke rute /order dan /orders (harus sudah login)
  if (pathname === "/order" || pathname.startsWith("/orders")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Cek akses ke rute /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload.role !== "admin") {
        // Pengguna biasa dilarang membuka rute admin
        const homeUrl = new URL("/?error=unauthorized", req.url);
        return NextResponse.redirect(homeUrl);
      }
    } catch {
      // Token tidak valid atau kedaluwarsa
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login sebagai admin dan membuka /login atau /register
  if ((pathname === "/login" || pathname === "/register") && token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/order", "/orders/:path*", "/login", "/register"],
};

