import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden bg-surface-cream pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      {/* Ambient Botanical Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="max-w-container mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-botanical-muted text-secondary font-semibold text-xs sm:text-sm shadow-sm border border-secondary/20">
              <span className="text-base leading-none">🌱</span>
              <span>100% Sari Buah & Sayur Organik Segar Berkualitas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-on-surface leading-[1.15] tracking-tight">
              Segarkan Harimu dengan Kebaikan Murni Alami dari{" "}
              <span className="text-primary-container italic font-black">
                Sari Buah Pilihan
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Jus cold-pressed murni tanpa tambahan setetes air pun, tanpa gula
              rafinasi, dan bebas bahan pengawet sintetik. Diekstrak perlahan
              dengan teknologi hidrolik dingin agar enzim aktif dan vitamin
              tetap utuh sempurna untuk tubuh Anda.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="#menu-varian"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary-container text-white font-bold text-base shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Pesan Sekarang</span>
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="#tentang-kami"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-surface-container text-on-surface font-semibold text-base hover:bg-surface-container-high transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  eco
                </span>
                <span>Kisah & Visi Kami</span>
              </Link>
            </div>

            {/* Trust Metrics Strip */}
            <div className="w-full pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-container">
              {siteConfig.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-on-surface-variant">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Offset Backdrop */}
              <div className="absolute inset-0 bg-secondary-container/70 rounded-3xl transform rotate-3 scale-102 transition-transform duration-300" />

              {/* Main Image Container */}
              <div className="relative bg-white p-3 rounded-3xl shadow-xl overflow-hidden border border-surface-container">
                <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-surface-cream">
                  <Image
                    src={siteConfig.assets.heroImage}
                    alt="Botol Cold Fresh Juice D'Juice aneka varian buah segar"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                {/* Scrim / Caption Pill */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-between shadow-md border border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs sm:text-sm text-on-surface font-bold">
                      Cold-Pressed Segar Setiap Hari
                    </span>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    100% Raw Juice
                  </span>
                </div>
              </div>

              {/* Floating Highlight Card: Top Left */}
              <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-surface-container hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-amber-subtle flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[22px]">
                    ac_unit
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    Dingin & Segar
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Diproses Suhu 4°C
                  </span>
                </div>
              </div>

              {/* Floating Highlight Card: Bottom Right */}
              <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-surface-container hover:translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-botanical-muted flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">
                    check_circle
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    0% Gula Tambahan
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Murni 100% Buah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

