"use client";

import { useEffect, useState } from "react";

interface AdminOrderItem {
  id: string;
  user_id: string;
  buyer_email?: string;
  buyer_account_name?: string;
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

function normalizeWhatsApp(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (!digits.startsWith("62")) {
    digits = "62" + digits;
  }
  return digits;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal Tolak Pesanan
  const [rejectModalOrder, setRejectModalOrder] = useState<AdminOrderItem | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPayment = async (order: AdminOrderItem) => {
    if (
      !confirm(
        `Konfirmasi pembayaran untuk tiket ${order.id} (${order.recipient_name})?`
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: "dikonfirmasi" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengonfirmasi pesanan.");
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    setRejectError("");
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalOrder.id,
          status: "ditolak",
          rejection_reason: rejectReason,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menolak pesanan.");
      setRejectModalOrder(null);
      setRejectReason("");
      fetchOrders();
    } catch (err: any) {
      setRejectError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.recipient_name.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q) ||
      o.whatsapp.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" ? true : o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Manajemen Pesanan & Konfirmasi QRIS
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Periksa tiket pesanan masuk, konfirmasi pembayaran QRIS, dan hubungi pembeli via WhatsApp.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor tiket, nama penerima, produk, atau nomor WA..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
          <option value="dikonfirmasi">Dikonfirmasi</option>
          <option value="ditolak">Ditolak / Dibatalkan</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-on-surface-variant border border-surface-container">
            Memuat daftar pesanan...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-container flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              receipt_long
            </span>
            <p className="text-sm font-bold text-on-surface">
              Belum ada tiket pesanan
            </p>
            <p className="text-xs text-on-surface-variant">
              Pesanan baru dari pelanggan akan muncul otomatis di halaman ini.
            </p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const waNumber = normalizeWhatsApp(ord.whatsapp);
            const waText = encodeURIComponent(
              `Halo Kak ${ord.recipient_name}, kami dari tim D'Juice mengonfirmasi pesanan ${ord.id} (${ord.product_name} x${ord.quantity} botol).`
            );
            const waLink = `https://wa.me/${waNumber}?text=${waText}`;

            return (
              <div
                key={ord.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-container">
                  <div className="flex flex-wrap items-center gap-2">
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
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      Dikonfirmasi
                    </span>
                  ) : ord.status === "ditolak" ? (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
                      Ditolak
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                      Menunggu Konfirmasi
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs">
                  <div className="md:col-span-5 space-y-1">
                    <p className="font-bold text-sm text-on-surface">
                      {ord.product_name} ({ord.quantity} botol)
                    </p>
                    <p className="text-base font-extrabold text-primary">
                      {formatRupiah(Number(ord.total_price))}
                    </p>
                    {ord.notes && (
                      <p className="text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl mt-2">
                        <strong>Catatan:</strong> {ord.notes}
                      </p>
                    )}
                    {ord.status === "ditolak" && ord.rejection_reason && (
                      <p className="text-red-700 bg-red-50 px-3 py-1.5 rounded-xl mt-2">
                        <strong>Alasan Tolak:</strong> {ord.rejection_reason}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-7 space-y-1 text-on-surface-variant">
                    <p>
                      <strong className="text-on-surface">Penerima:</strong>{" "}
                      {ord.recipient_name}{" "}
                      {ord.buyer_email ? `(${ord.buyer_email})` : ""}
                    </p>
                    <p>
                      <strong className="text-on-surface">WhatsApp:</strong>{" "}
                      {ord.whatsapp}
                    </p>
                    <p>
                      <strong className="text-on-surface">Alamat:</strong>{" "}
                      {ord.address}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-surface-container flex flex-wrap items-center justify-end gap-2.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-botanical-muted text-secondary font-bold text-xs hover:bg-secondary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      chat
                    </span>
                    <span>Hubungi via WhatsApp</span>
                  </a>

                  {ord.status === "menunggu_konfirmasi" && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => {
                          setRejectModalOrder(ord);
                          setRejectReason("");
                          setRejectError("");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          close
                        </span>
                        <span>Tolak / Batalkan</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleConfirmPayment(ord)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary-container text-white font-bold text-xs shadow-sm hover:bg-primary transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          check
                        </span>
                        <span>Konfirmasi Pembayaran</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Alasan Tolak */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-4">
              <h2 className="text-base font-bold text-on-surface">
                Tolak / Batalkan Pesanan {rejectModalOrder.id}
              </h2>
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {rejectError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {rejectError}
              </div>
            )}

            <form onSubmit={handleSubmitReject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="rejectReason"
                  className="text-xs font-bold text-on-surface"
                >
                  Alasan Pembatalan / Penolakan *
                </label>
                <textarea
                  id="rejectReason"
                  required
                  minLength={3}
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Pembayaran belum masuk setelah batas waktu, atau stok varian sedang habis."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOrder(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-full bg-red-600 text-white font-bold text-xs shadow-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Memproses..." : "Batalkan Pesanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

