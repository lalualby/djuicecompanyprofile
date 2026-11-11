"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { label: "Ringkasan", href: "/admin", icon: "dashboard" },
    { label: "Pesanan", href: "/admin/orders", icon: "receipt_long" },
    { label: "Manajemen Berita", href: "/admin/news", icon: "newspaper" },
    { label: "Manajemen Pengguna", href: "/admin/users", icon: "group" },
    { label: "Manajemen Role", href: "/admin/roles", icon: "shield_person" },
    { label: "Profil & Keamanan", href: "/admin/profile", icon: "manage_accounts" },
  ];

  return (
    <div className="min-h-screen bg-surface-cream/50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-container shrink-0 justify-between">
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-surface-container flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-cream p-1.5 flex items-center justify-center border border-surface-container shadow-sm">
              <Image
                src={siteConfig.assets.logo}
                alt={siteConfig.name}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-on-surface tracking-tight">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-primary-container text-white shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-surface-container flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              open_in_new
            </span>
            <span>Buka Website Utama</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-surface-container px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileNavOpen ? "close" : "menu"}
              </span>
            </button>
            <span className="text-sm font-bold text-on-surface hidden sm:inline">
              Dashboard Manajemen {siteConfig.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container">
              <div className="w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs">
                {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
              </div>
              <span className="text-xs font-bold text-on-surface hidden md:inline">
                {currentUser?.name || "Admin"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-subtle text-primary">
                {currentUser?.role || "admin"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar"
              className="p-2 rounded-xl text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border-b border-surface-container px-4 py-4 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  pathname === item.href
                    ? "bg-primary-container text-white"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-surface-container flex flex-col gap-1">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-secondary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>
                <span>Lihat Website</span>
              </Link>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

