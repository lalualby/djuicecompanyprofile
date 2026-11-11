"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-3"
          : "bg-surface/60 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-container mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="#beranda" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm p-1 border border-secondary-container/40 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src={siteConfig.assets.logo}
              alt={`${siteConfig.name} Logo`}
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-on-surface">
              {siteConfig.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-secondary font-bold -mt-1">
              Cold Fresh Juice
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/orders"
              className="text-sm font-bold text-primary hover:text-primary-container transition-colors tracking-wide"
            >
              Pesanan Anda
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-1.5">
              <Link
                href={user.role === "admin" ? "/admin" : "/orders"}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-botanical-muted text-on-surface font-semibold text-xs hover:bg-secondary-container hover:text-secondary-on-container transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </span>
                <span>{user.role === "admin" ? "Dashboard" : user.name}</span>
              </Link>
              <button
                type="button"
                title="Keluar"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  setUser(null);
                  window.location.href = "/";
                }}
                className="p-2 rounded-full text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-botanical-muted text-on-surface font-semibold text-xs hover:bg-secondary-container hover:text-secondary-on-container transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">
                account_circle
              </span>
              <span>Masuk</span>
            </Link>
          )}

          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-white font-semibold text-sm shadow-sm hover:bg-primary transition-all duration-200 active:scale-95"
          >
            <span>Pesan Sekarang</span>
            <span className="material-symbols-outlined text-[18px]">
              shopping_bag
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[26px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-pure/95 backdrop-blur-xl border-t border-surface-container shadow-xl px-6 py-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-on-surface hover:text-primary transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-primary hover:text-primary-container transition-colors py-1"
              >
                Pesanan Anda
              </Link>
            )}
            <div className="pt-4 border-t border-surface-container flex flex-col gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={user.role === "admin" ? "/admin" : "/orders"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-botanical-muted text-on-surface font-semibold text-xs"
                  >
                    <span>
                      {user.role === "admin"
                        ? "Buka Dashboard Admin"
                        : `Akun: ${user.name}`}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      setUser(null);
                      setMobileMenuOpen(false);
                      window.location.href = "/";
                    }}
                    className="px-4 py-2.5 rounded-full bg-red-50 text-red-600 font-semibold text-xs"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-botanical-muted text-on-surface font-semibold text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    account_circle
                  </span>
                  <span>Masuk Akun</span>
                </Link>
              )}
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary-container text-white font-semibold text-sm shadow-md"
              >
                <span>Pesan Sekarang</span>
                <span className="material-symbols-outlined text-[18px]">
                  shopping_bag
                </span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

