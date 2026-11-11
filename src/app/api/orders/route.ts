import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRecords, insertRecord } from "@/lib/db";
import { siteConfig } from "@/config/site";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu untuk melihat pesanan Anda." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    const allOrders = await getRecords("Orders");
    // Pastikan pengguna hanya bisa melihat pesanannya sendiri
    const userOrders = allOrders
      .filter((o: any) => String(o.user_id) === String(user.id))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    if (orderId) {
      const target = userOrders.find((o: any) => String(o.id) === String(orderId));
      if (!target) {
        return NextResponse.json(
          { error: "Pesanan tidak ditemukan atau Anda tidak memiliki akses." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: target });
    }

    return NextResponse.json({ success: true, data: userOrders });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal memuat pesanan: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu untuk membuat pesanan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const productId = String(body.product_id || "").trim();
    const quantity = Number(body.quantity);
    const recipientName = String(body.recipient_name || "").trim();
    const address = String(body.address || "").trim();
    const whatsappRaw = String(body.whatsapp || "").trim();
    const notes = String(body.notes || "").trim();

    // Validasi produk
    const product = siteConfig.products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: "Produk yang dipilih tidak valid." },
        { status: 400 }
      );
    }

    // Validasi jumlah
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: "Jumlah pesanan harus berupa angka bulat antara 1 hingga 100 botol." },
        { status: 400 }
      );
    }

    // Validasi nama penerima
    if (recipientName.length < 2 || recipientName.length > 100) {
      return NextResponse.json(
        { error: "Nama penerima wajib diisi (2 - 100 karakter)." },
        { status: 400 }
      );
    }

    // Validasi alamat
    if (address.length < 5 || address.length > 300) {
      return NextResponse.json(
        { error: "Alamat pengiriman wajib diisi lengkap (5 - 300 karakter)." },
        { status: 400 }
      );
    }

    // Validasi nomor WhatsApp
    const digitsOnly = whatsappRaw.replace(/\D/g, "");
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid (minimal 9 digit angka)." },
        { status: 400 }
      );
    }

    // Validasi catatan
    if (notes.length > 500) {
      return NextResponse.json(
        { error: "Catatan maksimal 500 karakter." },
        { status: 400 }
      );
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;
    const ticketId = `DJ-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    const newOrder = await insertRecord("Orders", {
      id: ticketId,
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      recipient_name: recipientName,
      address,
      whatsapp: whatsappRaw,
      notes,
      status: "menunggu_konfirmasi",
      rejection_reason: "",
    });

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal membuat pesanan: ${err.message}` },
      { status: 500 }
    );
  }
}

