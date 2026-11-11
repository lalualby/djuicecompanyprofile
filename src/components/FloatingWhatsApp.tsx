"use client";

import { siteConfig } from "@/config/site";

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=Halo%20${encodeURIComponent(
    siteConfig.name
  )},%20saya%20ingin%20memesan%20Cold%20Fresh%20Juice%20segar.`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pesan Cepat via WhatsApp"
        className="flex items-center gap-2.5 bg-secondary text-white px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 group"
      >
        <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">
          chat
        </span>
        <span className="text-sm font-bold tracking-wide hidden sm:inline">
          Pesan via WhatsApp
        </span>
      </a>
    </div>
  );
}

