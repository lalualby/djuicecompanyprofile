import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Services() {
  const iconMap: Record<string, string> = {
    spa: "spa",
    calendar: "calendar_today",
    briefcase: "corporate_fare",
    zap: "bolt",
  };

  return (
    <section id="layanan-produk" className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              PROGRAM & LAYANAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
              Solusi Nutrisi Lengkap Sesuai Kebutuhan
            </h2>
          </div>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
            Pilihan program nutrisi fleksibel yang dirancang untuk mendukung kesehatan
            jangka panjang, pemulihan metabolisme, dan energi aktif Anda.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((srv, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-botanical-muted flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    {iconMap[srv.icon] || "spa"}
                  </span>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-secondary font-bold text-[11px] mb-2">
                  {srv.badge}
                </span>
                <h3 className="text-lg font-bold text-on-surface mb-2 leading-snug">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-surface-container flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-primary-container">
                  {srv.price}
                </span>
                <Link
                  href="#kontak"
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-white transition-colors"
                  aria-label={`Konsultasi ${srv.title}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

