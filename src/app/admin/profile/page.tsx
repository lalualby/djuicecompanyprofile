"use client";

import { useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak sesuai.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengubah kata sandi.");

      setMessage("Kata sandi berhasil diperbarui dengan aman.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Profil & Keamanan Akun
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Perbarui kata sandi Anda untuk memastikan keamanan akses dashboard D'Juice.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center font-extrabold text-xl shrink-0">
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base text-on-surface">
            {user?.name || "Administrator"}
          </span>
          <span className="text-xs text-on-surface-variant">
            {user?.email || "admin@gmail.com"}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-subtle text-primary">
              Role: {user?.role || "admin"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Sesi Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-container shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-2">
          Ganti Kata Sandi
        </h2>
        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Sangat disarankan mengganti kata sandi bawaan <code>123456</code> dengan kata sandi yang kuat dan unik sebelum mempublikasikan sistem.
        </p>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              Kata Sandi Saat Ini *
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              Kata Sandi Baru *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              Ulangi Kata Sandi Baru *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 self-start px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Perbarui Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}

