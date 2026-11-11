import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-cream flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center border border-surface-container shadow-sm mb-5">
        <Image
          src={siteConfig.assets.logo}
          alt={siteConfig.name}
          width={44}
          height={44}
          className="object-contain"
        />
      </div>
      <span className="px-3 py-1 rounded-full bg-amber-subtle text-primary font-bold text-xs mb-3">
        Halaman Tidak Ditemukan (404)
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">
        Ups, Halaman Tidak Tersedia
      </h1>
      <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
        Maaf, halaman yang Anda cari mungkin telah dipindahkan atau alamat tautannya keliru. Yuk kembali ke halaman utama {siteConfig.name}.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">home</span>
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}

