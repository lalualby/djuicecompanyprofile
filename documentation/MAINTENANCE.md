# Maintenance Log

Dokumen ini mencatat rencana pengembangan lanjutan, temuan kendala/bug, serta riwayat perubahan website **D'Juice**.

## Backlog Fitur
- [ ] Integrasi Payment Gateway otomatis (Midtrans / Xendit QRIS dinamis) agar status pembayaran terkonfirmasi otomatis tanpa cek manual admin. *(Opsional — menanti konfirmasi Step 4.1)*
- [ ] Notifikasi otomatis via Email (Resend) atau WhatsApp (Meta WhatsApp Cloud API / BSP) saat pesanan masuk dan saat pembayaran dikonfirmasi. *(Opsional — menanti konfirmasi Step 4.1)*
- [ ] Cloud Media Storage (Vercel Blob / Cloudinary) agar gambar berita yang diunggah lewat Dashboard Admin tersimpan permanen di cloud saat hosting di Vercel (karena penyimpanan lokal serverless bersifat sementara). *(Opsional — menanti konfirmasi Step 4.1)*
- [ ] Custom domain usaha (misalnya `djuice.co.id` atau `djuice.id`) disambungkan ke Vercel.

## Bug Diketahui
- **Penyimpanan Upload Gambar di Vercel Serverless:** Pada mode default tanpa cloud storage, gambar berita baru yang diunggah ke `public/uploads/` bersifat sementara (ephemeral) pada environment serverless Vercel setelah deployment ulang atau pergantian instance. Solusi jangka panjang: aktifkan cloud storage (Vercel Blob / Cloudinary) jika admin akan rutin mengunggah banyak gambar berita baru di produksi.
- *(Belum ada bug fungsional lain yang dilaporkan pada hasil build saat ini.)*

## Riwayat Perubahan
- **2026-11-11 — Hardening Login Production:**
  - Menghapus banner **Akun Admin Bawaan** dan fungsi tombol **Isi Otomatis** di `/login` (`src/app/login/page.tsx`) agar kredensial admin tidak tampil publik saat mode production.
- **2026-11-11 — Perbaikan Bug WhatsApp Pesanan (Google Sheets Numeric Cell):**
  - Memperbaiki error `TypeError: raw.replace is not a function` di `/admin/orders` yang terjadi ketika Google Spreadsheet menyimpan nomor WhatsApp sebagai angka (`number`) dan menghapus angka `0` di depan.
  - Menambahkan `src/lib/whatsapp.ts` (`normalizeWhatsApp`, `formatWhatsAppDisplay`, `normalizeOrderRecord`) dan menerapkannya di `/api/orders`, `/api/admin/orders`, `/admin/orders`, `/orders`, dan `/orders/[id]`, serta format kolom teks `@` untuk `whatsapp` di `setup.gs`.
- **2026-11-11 — Step 4 (Persiapan Deploy, QA & QRIS Asli):**
  - Mengganti QRIS placeholder dengan gambar QRIS asli GoPay Merchant (`public/images/qris.jpg`) di `src/config/site.ts` dan menambahkan tombol simpan gambar QRIS di `/orders/[id]`.
  - Menambahkan halaman 404 khusus D'Juice (`src/app/not-found.tsx`).
  - Memperbarui `.gitignore` agar `src/data/db.json` tidak ikut terunggah ke GitHub.
  - Menambahkan panduan deployment Vercel & QA (`documentation/DEPLOY.md`) serta `documentation/MAINTENANCE.md`.
- **2026-11-11 — Step 3 (Sistem Pemesanan & QRIS):**
  - Menambahkan tabel `Orders` di `setup.gs` dan `src/lib/db.ts`.
  - Membuat halaman pemesanan `/order`, daftar tiket `/orders`, halaman pembayaran QRIS `/orders/[id]`, dan manajemen pesanan `/admin/orders`.
  - Menambahkan validasi harga server-side, status pesanan, alasan penolakan, serta pintasan WhatsApp.
- **2026-11-10 — Step 2 (User Management, Dashboard Admin & Google Spreadsheet):**
  - Integrasi Google Apps Script (`code.gs`, `setup.gs`), autentikasi JWT `httpOnly` + `bcryptjs`, dan middleware proteksi rute.
  - Dashboard admin (`/admin`) untuk ringkasan statistik, manajemen berita, user, role, dan profil.
- **2026-11-09 — Step 1 (Landing Page Company Profile):**
  - Setup Next.js App Router + Tailwind CSS + TypeScript, integrasi logo D'Juice, kisah owner sejak 2022, katalog 6 varian jus, layanan, kabar sehat, dan peta Google Maps Kalisari Jakarta Timur.

