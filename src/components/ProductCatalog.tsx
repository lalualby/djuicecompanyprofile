import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ProductCatalog() {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="menu-varian" className="w-full bg-surface-cream py-16 lg:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              PRODUK UNGGULAN KAMI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
              Menu Varian Cold Fresh Juice
            </h2>
          </div>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
            Diekstrak segar setiap subuh tanpa penambahan gula maupun air. Tersedia
            dalam botol higienis 350ml dan paket langganan mingguan.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.products.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container group"
            >
              {/* Card Visual / Bottle Mockup */}
              <div
                className={`relative w-full h-52 rounded-2xl ${item.colorScheme.bg} flex items-center justify-center overflow-hidden mb-5 border border-surface-container/50`}
              >
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white text-secondary font-bold text-xs shadow-sm border border-secondary/10">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container font-semibold text-xs text-on-surface-variant">
                    {item.volume}
                  </span>
                </div>

                {/* Stylized Artisan Bottle Graphic */}
                <div className="w-24 h-40 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-white shadow-lg flex flex-col justify-between p-2.5 items-center group-hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-2 rounded-full bg-stone-300" />
                  <div
                    className={`w-full h-24 rounded-xl ${item.colorScheme.bottleBg} shadow-inner flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-extrabold text-white text-center leading-tight px-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="w-12 h-1 rounded-full bg-stone-200" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-primary-container">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {item.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Ingredients chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Price & CTA */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-on-surface-variant">
                    Harga Satuan
                  </span>
                  <span className="text-lg font-extrabold text-primary">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <Link
                  href={`/order?product=${encodeURIComponent(item.id)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-sm hover:bg-primary transition-all duration-200 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_bag
                  </span>
                  <span>Pesan</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

