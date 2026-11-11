import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function About() {
  return (
    <section id="tentang-kami" className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-wider text-secondary font-bold">
            TENTANG {siteConfig.name.toUpperCase()}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
            Berawal dari Kesembuhan Alami, Dihadirkan untuk Anda
          </h2>
          <p className="text-base text-on-surface-variant mt-3 leading-relaxed">
            {siteConfig.story.summary}
          </p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Story & Proportion Bar */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative bg-white p-3 rounded-3xl shadow-md overflow-hidden border border-surface-container">
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-surface-cream">
                <Image
                  src={siteConfig.assets.aboutImage}
                  alt="Bahan baku buah dan sayuran segar D'Juice"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tag Overlay */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-secondary font-semibold text-xs border border-surface-container">
                <span className="material-symbols-outlined text-[16px]">
                  wb_sunny
                </span>
                <span>Dipetik Pagi, Diekstrak Segar</span>
              </div>
            </div>

            {/* Signature Cold-Press Blend Ingredient Bar */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-surface-container">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-on-surface">
                  Komposisi Rasa Golden Glow
                </span>
                <span className="text-xs font-semibold text-primary">
                  Signature Blend
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container flex overflow-hidden">
                <div
                  className="h-full bg-primary-container"
                  style={{ width: "55%" }}
                  title="Jeruk Valencia (55%)"
                />
                <div
                  className="h-full bg-amber-subtle"
                  style={{ width: "30%" }}
                  title="Wortel Organik (30%)"
                />
                <div
                  className="h-full bg-secondary-fixed-dim"
                  style={{ width: "15%" }}
                  title="Kunyit & Lemon (15%)"
                />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-on-surface-variant mt-2">
                <span>Jeruk Manis 55%</span>
                <span>Wortel Organik 30%</span>
                <span>Kunyit & Lemon 15%</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Pillars of Excellence */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Pillar 1 */}
            <div className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-surface-container hover:shadow-md transition-shadow">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-subtle flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">
                  water_drop
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-on-surface">
                  Teknologi Slow Cold-Press Hidrolik
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Kami tidak memakai bilah blender berkecepatan tinggi yang memicu panas dan merusak nutrisi. Tekanan hidrolik lambat kami mengunci hingga 98% enzim aktif, antioksidan, dan kemurnian rasa.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-surface-container hover:shadow-md transition-shadow">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-botanical-muted flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">
                  agriculture
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-on-surface">
                  Bahan Baku Petani Organik Lokal
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Bermitra langsung dengan kebun organik bersertifikat di dataran tinggi. Buah dan sayuran dipanen segar dan segera diproses di fasilitas kitchen berstandar sanitasi ketat.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-surface-container hover:shadow-md transition-shadow">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary-on-container">
                <span className="material-symbols-outlined text-[26px]">
                  verified
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-on-surface">
                  100% Murni Tanpa Bahan Tambahan
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Nol tetes air tambahan, nol gula pasir rafinasi, nol konsentrat sari rasa kimia, serta tanpa zat pengawet sintetik. Anda menikmati kesegaran sari alami yang sesungguhnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

