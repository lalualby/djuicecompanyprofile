"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from");
  const safeFrom =
    rawFrom && rawFrom.startsWith("/") && !rawFrom.startsWith("/admin")
      ? rawFrom
      : "/orders";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal.");
      }

      router.push(safeFrom);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-surface-container relative z-10">
      {/* Header Logo & Title */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-cream p-2 flex items-center justify-center border border-surface-container shadow-sm mb-3">
          <Image
            src={siteConfig.assets.logo}
            alt={siteConfig.name}
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Buat Akun Pelanggan
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Daftar untuk menikmati kemudahan pemesanan sari buah segar {siteConfig.name}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-bold text-on-surface"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-bold text-on-surface"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="budi@email.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-bold text-on-surface"
          >
            Kata Sandi (Min. 6 Karakter)
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-bold text-on-surface"
          >
            Konfirmasi Kata Sandi
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition-all duration-200 disabled:opacity-50 active:scale-98"
        >
          {loading ? (
            <span>Mendaftarkan...</span>
          ) : (
            <>
              <span>Daftar Sekarang</span>
              <span className="material-symbols-outlined text-[18px]">
                person_add
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 pt-4 border-t border-surface-container text-center text-xs text-on-surface-variant">
        <span>Sudah punya akun? </span>
        <Link
          href={rawFrom ? `/login?from=${encodeURIComponent(rawFrom)}` : "/login"}
          className="font-bold text-primary hover:underline"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface-cream flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Botanical Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      {/* Top back button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        <span>Kembali ke Beranda</span>
      </Link>

      <Suspense fallback={<div className="p-8 text-center text-sm">Memuat halaman...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
