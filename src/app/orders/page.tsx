"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatWhatsAppDisplay } from "@/lib/whatsapp";

interface OrderTicket {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  recipient_name: string;
  address: string;
  whatsapp: string;
  notes?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak";
  rejection_reason?: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Gagal memuat pesanan.");
        }
        setOrders(json.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              RIWAYAT & TIKET
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-1 tracking-tight">
              Pesanan Anda
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Pantau status pembayaran QRIS dan proses pengiriman jus segar Anda.
            </p>
          </div>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-primary transition-colors self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Buat Pesanan Baru</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-sm text-on-surface-variant border border-surface-container">
            Memuat daftar pesanan Anda...
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 text-center text-sm text-red-600 border border-red-200">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-container flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
              shopping_bag
            </span>
            <h2 className="text-lg font-bold text-on-surface">
              Belum Ada Pesanan
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              Anda belum memiliki tiket pesanan aktif. Yuk pilih varian Cold Fresh Juice favorit Anda sekarang!
            </p>
            <Link
              href="/order"
              className="mt-2 px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-primary transition-colors"
            >
              Pesan Jus Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-container">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-mono font-extrabold text-sm text-on-surface">
                      {ord.id}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      •{" "}
                      {new Date(ord.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {ord.status === "dikonfirmasi" ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Dikonfirmasi
                    </span>
                  ) : ord.status === "ditolak" ? (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                      Dibatalkan / Ditolak
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      Menunggu Konfirmasi
                    </span>
                  )}
                </div>

                {/* Pesan Status Konfirmasi / Penolakan */}
                {ord.status === "dikonfirmasi" && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[22px] text-emerald-600 shrink-0">
                      check_circle
                    </span>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu
                      informasi selanjutnya dari admin melalui email/WhatsApp.
                    </p>
                  </div>
                )}

                {ord.status === "ditolak" && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
                    <strong>Alasan Pembatalan:</strong>{" "}
                    {ord.rejection_reason || "Pesanan dibatalkan oleh admin."}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold text-on-surface text-base">
                      {ord.product_name} × {ord.quantity} botol
                    </p>
                    <p className="text-on-surface-variant">
                      Penerima: {ord.recipient_name} ({formatWhatsAppDisplay(ord.whatsapp)})
                    </p>
                    <p className="text-on-surface-variant line-clamp-1">
                      Alamat: {ord.address}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-lg font-extrabold text-primary">
                      {formatRupiah(Number(ord.total_price))}
                    </span>
                    <Link
                      href={`/orders/${encodeURIComponent(ord.id)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container text-on-surface font-bold text-xs hover:bg-primary-container hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {ord.status === "menunggu_konfirmasi"
                          ? "qr_code_2"
                          : "visibility"}
                      </span>
                      <span>
                        {ord.status === "menunggu_konfirmasi"
                          ? "Lihat QRIS Pembayaran"
                          : "Detail Tiket"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

