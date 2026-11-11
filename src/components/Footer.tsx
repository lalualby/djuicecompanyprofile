import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container">
      <div className="max-w-container mx-auto px-5 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm p-1 border border-secondary-container/40 flex items-center justify-center">
                <Image
                  src={siteConfig.assets.logo}
                  alt={`${siteConfig.name} Logo`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-on-surface">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Kesegaran murni 100% buah dan sayuran segar tanpa gula dan air tambahan.
              Mendukung vitalitas dan gaya hidup sehat alami sejak 2022.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-on-surface tracking-wider uppercase">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
              {siteConfig.navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-on-surface tracking-wider uppercase">
              Kontak Kami
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-on-surface-variant">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  location_on
                </span>
                <span>{siteConfig.contact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                  mail
                </span>
                <span>{siteConfig.contact.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                  call
                </span>
                <span>{siteConfig.contact.phone}</span>
              </p>
            </div>
          </div>

          {/* Col 4: Socials & Operational */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-on-surface tracking-wider uppercase">
              Ikuti Media Sosial
            </h4>
            <div className="flex items-center gap-2 pt-1">
              {siteConfig.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  className="w-9 h-9 rounded-full bg-botanical-muted flex items-center justify-center text-secondary hover:bg-secondary-container hover:text-secondary-on-container transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {soc.name === "Instagram"
                      ? "photo_camera"
                      : soc.name === "WhatsApp"
                      ? "chat"
                      : soc.name === "YouTube"
                      ? "play_circle"
                      : "share"}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant pt-2">
              Jam Buka: {siteConfig.contact.hours}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-on-surface-variant">
          <p>© 2026 {siteConfig.name} Indonesia. Seluruh hak cipta dilindungi.</p>
          <p className="text-tertiary font-semibold">
            Segar Murni Alami • Diproses Dingin Setiap Hari
          </p>
        </div>
      </div>
    </footer>
  );
}

