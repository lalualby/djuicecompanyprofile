"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { formatWhatsAppDisplay } from "@/lib/whatsapp";

interface OrderDetail {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  recipient_name: string;
  address: string;
  whatsapp: string;
  notes?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak";
  rejection_reason?: string;
  created_at: string;
}

export default function OrderPaymentPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders?id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Pesanan tidak ditemukan.");
        }
        setOrder(json.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen flex flex-col bg-surface-cream">
      <Navbar />
      <main className="flex-1 max-w-container w-full mx-auto px-5 sm:px-8 pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            <span>Kembali ke Pesanan Anda</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-sm text-on-surface-variant border border-surface-container">
            Memuat detail tiket pesanan...
          </div>
        ) : error || !order ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-red-200 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-2">
              error
            </span>
            <h1 className="text-lg font-bold text-on-surface">
              Pesanan Tidak Dapat Dibuka
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 mb-5">
              {error || "Tiket pesanan tidak ditemukan."}
            </p>
            <Link
              href="/orders"
              className="inline-flex px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs"
            >
              Lihat Pesanan Anda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kiri: Ringkasan Tiket & Status */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-container mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Nomor Tiket Pesanan
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface font-mono">
                      {order.id}
                    </h1>
                  </div>

                  {order.status === "dikonfirmasi" ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Pembayaran Dikonfirmasi
                    </span>
                  ) : order.status === "ditolak" ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                      Dibatalkan / Ditolak
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      Menunggu Konfirmasi
                    </span>
                  )}
                </div>

                {/* Banner status khusus */}
                {order.status === "dikonfirmasi" && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] text-emerald-600 shrink-0">
                      check_circle
                    </span>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu
                      informasi selanjutnya dari admin melalui email/WhatsApp.
                    </p>
                  </div>
                )}

                {order.status === "ditolak" && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] shrink-0">
                      cancel
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold">
                        Pesanan Dibatalkan / Ditolak
                      </p>
                      <p className="text-xs mt-0.5">
                        Alasan: {order.rejection_reason || "Tidak ada keterangan."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detail Pesanan */}
                <h2 className="text-base font-bold text-on-surface mb-3">
                  Ringkasan Pesanan
                </h2>
                <div className="space-y-3 text-sm bg-surface-container-low p-4 rounded-2xl border border-surface-container">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Produk</span>
                    <span className="font-bold text-on-surface">
                      {order.product_name} ({order.quantity} botol)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Harga Satuan</span>
                    <span className="text-on-surface">
                      {formatRupiah(Number(order.unit_price))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-surface-container">
                    <span className="font-bold text-on-surface">Total Tagihan</span>
                    <span className="text-lg font-extrabold text-primary">
                      {formatRupiah(Number(order.total_price))}
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-on-surface mt-6 mb-3">
                  Informasi Pengiriman
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                  <p>
                    <strong className="text-on-surface">Penerima:</strong>{" "}
                    {order.recipient_name}
                  </p>
                  <p>
                    <strong className="text-on-surface">WhatsApp:</strong>{" "}
                    {formatWhatsAppDisplay(order.whatsapp)}
                  </p>
                  <p>
                    <strong className="text-on-surface">Alamat:</strong>{" "}
                    {order.address}
                  </p>
                  {order.notes && (
                    <p>
                      <strong className="text-on-surface">Catatan:</strong>{" "}
                      {order.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Kanan: Gambar QRIS & Instruksi Pembayaran */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full bg-amber-subtle text-primary font-bold text-xs mb-3">
                Pembayaran QRIS
              </span>
              <h2 className="text-xl font-extrabold text-on-surface">
                Scan untuk Membayar
              </h2>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">
                Nominal transfer:{" "}
                <strong className="text-primary text-sm">
                  {formatRupiah(Number(order.total_price))}
                </strong>
              </p>

              <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-surface-container shadow-sm bg-white mb-3">
                <Image
                  src={siteConfig.assets.qrisImage}
                  alt="QRIS Pembayaran D'Juice - Mohammad Ammar Ayyasy, Digital & Kreatif"
                  fill
                  className="object-contain"
                  sizes="280px"
                  priority
                />
              </div>

              <a
                href={siteConfig.assets.qrisImage}
                download="QRIS-DJuice.jpg"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  download
                </span>
                <span>Simpan Gambar QRIS ke Perangkat</span>
              </a>

              <div className="w-full text-left bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-2 text-xs text-on-surface-variant">
                <p className="font-bold text-on-surface">
                  Instruksi Singkat Pembayaran:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    Buka aplikasi m-banking atau e-wallet (GoPay, OVO, DANA,
                    ShopeePay, BCA, Mandiri, dll).
                  </li>
                  <li>
                    Pilih menu <strong>Scan QRIS</strong> lalu arahkan ke kode QR di atas.
                  </li>
                  <li>
                    Masukkan nominal tepat{" "}
                    <strong>{formatRupiah(Number(order.total_price))}</strong> dan
                    selesaikan pembayaran.
                  </li>
                  <li>
                    Admin kami akan memverifikasi pembayaran Anda dan status tiket
                    di menu <strong>Pesanan Anda</strong> akan berubah menjadi{" "}
                    <em>Dikonfirmasi</em>.
                  </li>
                </ol>
              </div>

              <Link
                href="/orders"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-secondary text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity"
              >
                <span>Pantau Status di Pesanan Anda</span>
                <span className="material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

