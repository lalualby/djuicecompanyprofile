"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "detox",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Optional: send directly to WhatsApp
    const text = encodeURIComponent(
      `Halo ${siteConfig.name},\nSaya: ${formData.name}\nEmail: ${formData.email}\nNo HP: ${formData.phone}\nLayanan: ${formData.service}\nPesan: ${formData.message}`
    );
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <section id="kontak" className="w-full bg-surface-cream py-16 lg:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            HUBUNGI KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
            Kunjungi Flagship Kitchen & Sapa Kami
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
            Punya pertanyaan mengenai program detoksifikasi, pesanan korporat, atau
            rekomendasi varian untuk kondisi kesehatan Anda? Tim kami siap melayani.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Info Cards & Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-surface-container flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-subtle flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    location_on
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    Flagship Kitchen
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-sm border border-surface-container flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-botanical-muted flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    schedule
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    Jam Operasional
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {siteConfig.contact.hours}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-sm border border-surface-container flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/60 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    chat
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    WhatsApp Resmi
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5">
                    {siteConfig.contact.phone}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-sm border border-surface-container flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-subtle flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    mail
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    Surel Tim
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5">
                    {siteConfig.contact.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container">
              <h3 className="text-xl font-bold text-on-surface mb-2">
                Kirim Pesan atau Konsultasi
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
                Isi form di bawah ini dan kami akan segera membalas langsung ke nomor WhatsApp Anda.
              </p>

              {isSubmitted ? (
                <div className="p-4 rounded-2xl bg-secondary-container/40 border border-secondary/30 flex items-center gap-3 text-secondary">
                  <span className="material-symbols-outlined text-[24px]">
                    check_circle
                  </span>
                  <p className="text-sm font-semibold">
                    Terima kasih! Pesan Anda telah kami terima dan terhubung ke WhatsApp kami.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="fullName"
                        className="text-xs font-bold text-on-surface"
                      >
                        Nama Lengkap *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Contoh: Anindya Putri"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="userEmail"
                        className="text-xs font-bold text-on-surface"
                      >
                        Alamat Email *
                      </label>
                      <input
                        id="userEmail"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="anindya@email.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="phoneNumber"
                        className="text-xs font-bold text-on-surface"
                      >
                        Nomor WhatsApp *
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="serviceType"
                        className="text-xs font-bold text-on-surface"
                      >
                        Pilihan Program / Layanan
                      </label>
                      <select
                        id="serviceType"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      >
                        <option value="detox">Paket Detox & Cleanse (3-7 Hari)</option>
                        <option value="langganan">Langganan Rutin Kantor & Rumah</option>
                        <option value="catering">Catering & Corporate Event</option>
                        <option value="umum">Konsultasi Umum / Reseller</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="userMessage"
                      className="text-xs font-bold text-on-surface"
                    >
                      Pesan atau Kebutuhan Spesifik *
                    </label>
                    <textarea
                      id="userMessage"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tuliskan varian favorit, riwayat keluhan, atau jadwal pengiriman yang Anda inginkan..."
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition-all duration-200 self-start active:scale-95"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined text-[18px]">
                      send
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-surface-container overflow-hidden">
              {/* Google Maps Iframe */}
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-surface-container">
                <iframe
                  title="Lokasi D'Juice di Google Maps"
                  src={siteConfig.contact.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Store Details Card */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-secondary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">
                      storefront
                    </span>
                    <span>Cold-Press Juice Bar & Pick-up</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-secondary-on-container font-bold text-[11px]">
                    Buka Hari Ini
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Nikmati sesi konsultasi nutrisi langsung bersama tim kami atau
                  lakukan quick drive-thru pick-up pesanan harian Anda.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        local_parking
                      </span>
                      <span>Parkir</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        wifi
                      </span>
                      <span>Wi-Fi</span>
                    </span>
                  </div>

                  <a
                    href={siteConfig.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary-container text-white font-bold text-xs hover:bg-primary transition-colors"
                  >
                    <span>Petunjuk Arah</span>
                    <span className="material-symbols-outlined text-[16px]">
                      directions
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

