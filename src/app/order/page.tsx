"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || siteConfig.products[0].id;

  const [productId, setProductId] = useState(
    siteConfig.products.some((p) => p.id === initialProduct)
      ? initialProduct
      : siteConfig.products[0].id
  );
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.name) {
          setRecipientName((prev) => prev || data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const selectedProduct =
    siteConfig.products.find((p) => p.id === productId) || siteConfig.products[0];
  const totalPrice = selectedProduct.price * Math.max(1, quantity);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          quantity: Number(quantity),
          recipient_name: recipientName,
          address,
          whatsapp,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?from=${encodeURIComponent(`/order?product=${productId}`)}`);
          return;
        }
        throw new Error(json.error || "Gagal membuat pesanan.");
      }

      router.push(`/orders/${encodeURIComponent(json.data.id)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-container mx-auto px-5 sm:px-8 pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="mb-8">
        <Link
          href="/#menu-varian"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:text-primary transition-colors mb-3"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Daftar Menu</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Form Pemesanan Cold Fresh Juice
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Lengkapi detail pengiriman di bawah ini untuk mendapatkan tiket pesanan dan kode QRIS pembayaran.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Pemesanan */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label
                  htmlFor="product_id"
                  className="text-xs font-bold text-on-surface"
                >
                  Pilih Varian Jus *
                </label>
                <select
                  id="product_id"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                >
                  {siteConfig.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.volume}) — {formatRupiah(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="quantity"
                  className="text-xs font-bold text-on-surface"
                >
                  Jumlah (Botol) *
                </label>
                <div className="flex items-center border border-surface-container rounded-xl bg-surface-container-low overflow-hidden">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-on-surface hover:bg-surface-container font-bold"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
                    }
                    className="w-full text-center bg-transparent text-sm font-bold text-on-surface focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                    className="px-3 py-2.5 text-on-surface hover:bg-surface-container font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="recipient_name"
                  className="text-xs font-bold text-on-surface"
                >
                  Nama Penerima *
                </label>
                <input
                  id="recipient_name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Contoh: Anindya Putri"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="whatsapp"
                  className="text-xs font-bold text-on-surface"
                >
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="address"
                className="text-xs font-bold text-on-surface"
              >
                Alamat Pengiriman Lengkap *
              </label>
              <textarea
                id="address"
                required
                minLength={5}
                maxLength={300}
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="notes"
                className="text-xs font-bold text-on-surface"
              >
                Catatan Tambahan (Opsional)
              </label>
              <input
                id="notes"
                type="text"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kirim jam 08.00 pagi, tanpa es..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <span>Membuat Tiket Pesanan...</span>
              ) : (
                <>
                  <span>Lanjut ke Pembayaran QRIS</span>
                  <span className="material-symbols-outlined text-[20px]">
                    qr_code_2
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container sticky top-28">
          <h2 className="text-lg font-bold text-on-surface mb-4">
            Ringkasan Pesanan
          </h2>

          <div className="p-4 rounded-2xl bg-surface-cream border border-surface-container mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-secondary font-bold text-[11px] mb-1">
                  {selectedProduct.tag}
                </span>
                <h3 className="text-base font-extrabold text-on-surface">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {selectedProduct.volume} • {selectedProduct.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-sm border-t border-surface-container pt-4">
            <div className="flex justify-between text-on-surface-variant">
              <span>Harga Satuan</span>
              <span className="font-semibold text-on-surface">
                {formatRupiah(selectedProduct.price)}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Jumlah</span>
              <span className="font-semibold text-on-surface">
                {quantity} botol
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-surface-container">
              <span className="font-bold text-on-surface">Total Pembayaran</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-botanical-muted/70 text-xs text-secondary leading-relaxed flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              verified_user
            </span>
            <span>
              Setelah mengirim form, Anda akan diarahkan ke halaman pembayaran QRIS dan memperoleh tiket pesanan yang dapat dipantau di menu <strong>Pesanan Anda</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-cream">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="pt-36 pb-24 text-center text-sm text-on-surface-variant">
              Memuat form pemesanan...
            </div>
          }
        >
          <OrderFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

