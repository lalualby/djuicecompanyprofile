import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRecords, updateRecord } from "@/lib/db";

const ALLOWED_STATUSES = ["menunggu_konfirmasi", "dikonfirmasi", "ditolak"] as const;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const [orders, users] = await Promise.all([
      getRecords("Orders"),
      getRecords("Users"),
    ]);

    const enriched = orders
      .map((o: any) => {
        const buyer = users.find((u: any) => String(u.id) === String(o.user_id));
        return {
          ...o,
          buyer_email: buyer ? buyer.email : "",
          buyer_account_name: buyer ? buyer.name : "",
        };
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { id, status, rejection_reason } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID pesanan wajib disertakan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const reasonText = String(rejection_reason || "").trim();
    if (status === "ditolak" && reasonText.length < 3) {
      return NextResponse.json(
        { error: "Mohon cantumkan alasan penolakan/pembatalan pesanan." },
        { status: 400 }
      );
    }

    const updated = await updateRecord("Orders", id, {
      status,
      rejection_reason: status === "ditolak" ? reasonText : "",
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

