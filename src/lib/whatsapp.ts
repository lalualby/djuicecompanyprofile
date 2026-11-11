/**
 * Helper normalisasi & tampilan nomor WhatsApp agar aman terhadap angka
 * yang tersimpan sebagai number di Google Spreadsheet (mis. kehilangan angka 0 di depan).
 */

export function normalizeWhatsApp(raw: unknown): string {
  const text = String(raw ?? "").trim();
  if (!text) return "";

  let digits = text.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (!digits.startsWith("62")) {
    digits = "62" + digits;
  }
  return digits;
}

export function formatWhatsAppDisplay(raw: unknown): string {
  const digits = normalizeWhatsApp(raw);
  if (!digits) return "-";
  if (digits.startsWith("62")) {
    return "0" + digits.slice(2);
  }
  return digits;
}

export function normalizeOrderRecord<T extends Record<string, any>>(order: T): T {
  const waDigits = normalizeWhatsApp(order.whatsapp);
  return {
    ...order,
    id: String(order.id ?? ""),
    user_id: String(order.user_id ?? ""),
    product_id: String(order.product_id ?? ""),
    product_name: String(order.product_name ?? ""),
    quantity: Number(order.quantity || 0),
    unit_price: Number(order.unit_price || 0),
    total_price: Number(order.total_price || 0),
    recipient_name: String(order.recipient_name ?? ""),
    address: String(order.address ?? ""),
    whatsapp: waDigits || String(order.whatsapp ?? ""),
    notes: String(order.notes ?? ""),
    status: String(order.status || "menunggu_konfirmasi"),
    rejection_reason: String(order.rejection_reason ?? ""),
    created_at: String(order.created_at ?? ""),
  };
}

