# Panduan Deploy ke Vercel & Checklist QA - D'Juice

Dokumen ini memandu Anda meluncurkan website **D'Juice** ke internet publik menggunakan **Vercel** agar dapat diakses pelanggan dari mana saja.

---

## Istilah Penting (Singkat & Sederhana)
- **Repository (Repo GitHub):** Folder proyek online di GitHub tempat menyimpan kode website secara aman agar Vercel bisa mengambil dan memperbarui website Anda otomatis setiap kali ada perubahan.
- **Environment Variable:** Variabel rahasia (seperti URL Google Apps Script, kunci sesi login `SESSION_SECRET`, dan token rahasia) yang disimpan terpisah di pengaturan Vercel, bukan di dalam kode, agar tidak bocor ke publik.

---

## Langkah 1-8: Deploy ke Vercel

1. **Pastikan File Rahasia Tidak Masuk GitHub**
   - File `.gitignore` sudah mengatur agar `.env.local`, `code.gs`, `setup.gs`, `public/uploads/*`, dan `src/data/db.json` **tidak ikut terunggah** ke GitHub.
   - Jangan pernah menghapus baris tersebut dari `.gitignore`.

2. **Upload Proyek ke GitHub**
   - Login ke [github.com](https://github.com) lalu buat repository baru (misalnya `djuice-company-profile`, boleh diset **Private**).
   - Unggah proyek ini ke repository tersebut (via GitHub Desktop atau perintah `git push`).

3. **Sambungkan GitHub ke Vercel**
   - Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
   - Klik **Add New... > Project**, lalu pilih repository `djuice-company-profile` dan klik **Import**.

4. **Isi Environment Variables (Wajib Sebelum Klik Deploy)**
   - Di halaman konfigurasi proyek Vercel, buka bagian **Environment Variables**, lalu masukkan **semua** variabel yang ada di file `.env.local` Anda (lihat contoh format di `.env.example`):
     - `APPS_SCRIPT_URL` -> URL Web App Google Apps Script Anda (`/exec`)
     - `APPS_SCRIPT_SECRET` -> Token rahasia yang sama persis dengan `SECRET_TOKEN` di `code.gs`
     - `SESSION_SECRET` -> Kunci acak minimal 32 karakter untuk mengamankan cookie login
   - Pastikan ketiganya dicentang untuk **Production** (dan Preview bila perlu).

5. **Klik Deploy & Tunggu Selesai**
   - Klik tombol **Deploy**. Vercel akan membangun proyek Next.js dan memberikan alamat URL aktif (misalnya `https://djuice-company-profile.vercel.app`).

6. **Verifikasi Google Apps Script**
   - Pastikan di editor Google Apps Script proyek Spreadsheet Anda:
     - Fungsi `initTables()` dari `setup.gs` sudah pernah dijalankan sehingga tab **`Roles`**, **`Users`**, **`News`**, dan **`Orders`** lengkap beserta header-nya.
     - `code.gs` sudah di-deploy sebagai **Web App** dengan akses **"Anyone"** (Siapa saja).

7. **Uji Website Production**
   - Buka URL Vercel Anda lalu uji alur penting:
     - Halaman utama (`/`), tampilan mobile & desktop.
     - Daftar akun pelanggan (`/register`) -> Login (`/login`) -> Pesan jus (`/order`) -> Halaman QRIS (`/orders/[id]`).
     - Login admin (`/login`) -> Dashboard `/admin/orders` (Konfirmasi QRIS) -> Dashboard `/admin/news`.

8. **Wajib Ganti Password Admin Default Setelah Login Pertama**
   - Akun admin awal memakai email `admin@gmail.com` dan password bawaan `admin`.
   - Segera buka menu **Profil** di Dashboard Admin (`/admin/profile`) dan ganti password dengan kombinasi yang kuat.

---

## Checklist Quality Assurance (QA) Pra-Rilis

- [x] **Build produksi bersih (`npm run build`)** — Berhasil kompilasi Next.js App Router tanpa error TypeScript maupun bundling.
- [x] **Proteksi rute admin & pesanan** — `src/middleware.ts` memblokir akses `/admin/*` selain role `admin`, serta mewajibkan login untuk `/order`, `/orders/*`, `/api/orders`, dan `/api/admin/*`.
- [x] **Tidak ada secret di kode/repo** — `.env.local`, `code.gs`, `setup.gs`, `src/data/db.json` dikecualikan di `.gitignore`; `SESSION_SECRET`, `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET` dibaca dari `process.env`.
- [x] **SEO & Favicon** — Title, description, keywords, OpenGraph, dan ikon/favicon (`/images/logo.png`) terpasang di `src/app/layout.tsx`.
- [x] **Halaman 404 khusus** — `src/app/not-found.tsx` menampilkan halaman 404 berbahasa Indonesia sesuai identitas visual D'Juice.
- [x] **QRIS Asli Terpasang** — Gambar QRIS GoPay Merchant (`public/images/qris.jpg`) aktif di `src/config/site.ts` dan tampil di halaman pembayaran tiket.
- [ ] **Uji browser langsung (konsol, responsif, aksesibilitas)** — Disarankan menguji langsung di browser saat `npm run dev` atau sesudah URL Vercel aktif (cek DevTools Console, ukuran layar 375px / 768px / 1280px, dan navigasi keyboard).

