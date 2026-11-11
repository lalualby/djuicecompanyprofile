"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    newsCount: 0,
    usersCount: 0,
    rolesCount: 0,
    publishedNews: 0,
    ordersCount: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/news").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/roles").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ])
      .then(([newsRes, usersRes, rolesRes, ordersRes]) => {
        const newsList = newsRes.data || [];
        const usersList = usersRes.data || [];
        const rolesList = rolesRes.data || [];
        const ordersList = ordersRes.data || [];

        setStats({
          newsCount: newsList.length,
          publishedNews: newsList.filter((n: any) => n.status === "published").length,
          usersCount: usersList.length,
          rolesCount: rolesList.length,
          ordersCount: ordersList.length,
          pendingOrders: ordersList.filter(
            (o: any) => o.status === "menunggu_konfirmasi"
          ).length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Selamat datang di panel kendali konten dan pengguna D'Juice.
        </p>
      </div>

      {/* Security Advisory Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              security
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-amber-900">
              Peringatan Keamanan Akun Bawaan
            </h2>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              Akun admin awal Anda menggunakan email <code>admin@gmail.com</code> dan kata sandi umum. Segera perbarui kata sandi Anda di menu Profil & Keamanan sebelum website dipublikasikan ke production.
            </p>
          </div>
        </div>
        <Link
          href="/admin/profile"
          className="shrink-0 px-4 py-2 rounded-full bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition-colors"
        >
          Ganti Kata Sandi
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Total Berita & Artikel
            </span>
            <div className="text-3xl font-extrabold text-on-surface mt-1">
              {loading ? "..." : stats.newsCount}
            </div>
            <span className="text-[11px] text-secondary font-bold">
              {stats.publishedNews} Terpublikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-subtle text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">
              newspaper
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Total Pengguna
            </span>
            <div className="text-3xl font-extrabold text-on-surface mt-1">
              {loading ? "..." : stats.usersCount}
            </div>
            <span className="text-[11px] text-secondary font-bold">
              Admin & Customer
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-botanical-muted text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">
              group
            </span>
          </div>
        </div>

        <Link
          href="/admin/orders"
          className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between hover:border-primary-container transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Pesanan Masuk
            </span>
            <div className="text-3xl font-extrabold text-on-surface mt-1">
              {loading ? "..." : stats.ordersCount}
            </div>
            <span className="text-[11px] text-primary font-bold">
              {stats.pendingOrders} Menunggu Konfirmasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">
              receipt_long
            </span>
          </div>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Koneksi Database
            </span>
            <div className="text-sm font-extrabold text-secondary mt-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tersambung</span>
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Spreadsheet / Fallback Ready
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">
              table_chart
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/news"
            className="p-4 rounded-2xl bg-surface-container-low border border-surface-container hover:border-primary-container transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">
                post_add
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Tulis Berita Baru
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Publikasikan artikel edukasi nutrisi ke landing page.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 rounded-2xl bg-surface-container-low border border-surface-container hover:border-primary-container transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">
                person_search
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Kelola Pengguna
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Ubah role akun atau aktifkan/nonaktifkan akses.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/roles"
            className="p-4 rounded-2xl bg-surface-container-low border border-surface-container hover:border-primary-container transition-all group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-on-surface-variant group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">
                add_moderator
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Tambah Role Baru
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Konfigurasikan role khusus di luar role bawaan sistem.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

