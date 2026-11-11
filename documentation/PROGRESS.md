# Progres Proyek - D'Juice

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **Step 4 - QA, Integrasi QRIS Asli, & Persiapan Deploy Vercel**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Setup Next.js App Router + Tailwind CSS + TypeScript (Vercel-ready)
  - [x] Konfigurasi terpusat di `src/config/site.ts`
  - [x] Logo pengguna diintegrasikan di Navbar & Footer (`public/images/logo.png`)
  - [x] Hero Section (Judul, Subjudul, CTA, Trust Metrics, Visual Produk)
  - [x] About Section (Kisah personal owner sembuh dari sakit/overweight & beroperasi sejak 2022, Bar Proporsi Rasa, 3 Pilar Keunggulan)
  - [x] Menu Varian / Katalog Cold Fresh Juice (6 Varian botol 350ml, badge nutrisi, rating, tombol pesan)
  - [x] Program & Layanan (Paket Detox 3-7 hari, Langganan Harian, Corporate Event, Energy Booster)
  - [x] Berita / Kabar Sehat (3 artikel edukasi cold-press, terhubung dinamis ke database)
  - [x] Kontak & Toko (Info Flagship Kitchen Kalisari Jakarta Timur, jam buka, form pesan, Google Maps embed & directions)
  - [x] Footer lengkap dengan tautan cepat, media sosial, dan hak cipta
  - [x] Responsive di mobile (375px), tablet (768px), desktop (1280px) & ramah aksesibilitas
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) + inisiasi tabel Google Spreadsheet otomatis (idempoten)
  - [x] Panduan setup Apps Script & Spreadsheet di `documentation/SETUP.md`
  - [x] Login & Register lengkap dengan validasi dan hashing password (bcryptjs)
  - [x] Role admin & user dengan proteksi rute di Middleware (`jose` JWT cookie httpOnly)
  - [x] Dashboard Admin: Overview stats, Manajemen Berita (CRUD + upload gambar), Manajemen User, Manajemen Role, Profil & Ganti Password
  - [x] Upload media lokal aman di `public/uploads/` via `src/lib/storage.ts`
  - [x] Integrasi artikel dinamis ke landing page via `/api/news`
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan & QRIS
  - [x] Tabel `Orders` ditambahkan secara idempoten di `setup.gs` (`initTables()`) dan `src/lib/db.ts`
  - [x] Form pemesanan khusus jual beli jus (`/order`) dengan validasi server-side (`/api/orders`)
  - [x] Halaman pembayaran QRIS & detail tiket (`/orders/[id]`) dengan gambar QRIS asli GoPay Merchant (`public/images/qris.jpg`) & tombol simpan QRIS
  - [x] Menu **"Pesanan Anda"** (`/orders`) di Navbar (hanya tampil & bisa diakses bila pengguna sudah login)
  - [x] Redirect otomatis ke `/login` lalu kembali ke form pemesanan jika belum login
  - [x] Menu **Pesanan** (`/admin/orders`) di Dashboard Admin: daftar tiket, Konfirmasi Pembayaran, Tolak/Batalkan dengan alasan, dan tombol pintas "Hubungi via WhatsApp"
  - [x] Pesan konfirmasi otomatis tampil di "Pesanan Anda" setelah admin menyetujui pembayaran
  - [x] Dikonfirmasi pengguna (melanjutkan ke Step 4 & memasang foto QRIS)
- [ ] STEP 4 - Deploy & maintenance
  - [x] Halaman 404 khusus D'Juice (`src/app/not-found.tsx`) & update `.gitignore` (`src/data/db.json`)
  - [x] Panduan deploy Vercel & checklist QA di `documentation/DEPLOY.md`
  - [x] Log maintenance di `documentation/MAINTENANCE.md`
  - [x] Konfirmasi opsi enhancement Step 4.1 (memakai versi rilis awal tanpa integrasi tambahan)
  - [x] Inisialisasi Git lokal & commit awal aman (tanpa file rahasia)
  - [ ] Upload ke GitHub & Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Catatan Penting Step 3
1. **Update Tabel `Orders` di Google Spreadsheet:**  
   Karena Anda sudah menyambungkan `.env.local` ke Apps Script, jangan lupa salin ulang isi [`setup.gs`](file:///c:/Users/lalua/OneDrive/Documents/File%20Belajar%20HTML%20(kelas%20x)/Company%20Profile/D'Juice/setup.gs) terbaru ke editor Apps Script lalu jalankan fungsi **`initTables`** sekali lagi agar sheet **`Orders`** otomatis dibuat tanpa menimpa data lama.
2. **Gambar QRIS Aktif:**  
   Halaman pembayaran sudah menggunakan gambar QRIS GoPay Merchant di `public/images/qris.jpg` (diatur lewat `qrisImage` di `src/config/site.ts`), lengkap dengan tombol simpan gambar ke perangkat. Jika suatu saat ingin mengganti QRIS, cukup ganti file atau path `qrisImage` di `src/config/site.ts`.
3. **Keamanan Pemesanan:**  
   - Total harga dihitung di server berdasarkan harga resmi di `src/config/site.ts` (tidak mempercayai harga dari browser).
   - Pengguna hanya dapat melihat tiket miliknya (`user_id` dicek di server).
   - Hanya akun ber-role `admin` yang dapat mengubah status pesanan.

## Cara Menguji Step 3
1. Jalankan `npm run dev` di terminal.
2. Buka `http://localhost:3000`, klik **Pesan** pada salah satu varian jus. Jika belum login, Anda akan diarahkan ke `/login` (atau daftar akun pelanggan di `/register`) lalu otomatis kembali ke form `/order`.
3. Isi jumlah, nama penerima, alamat, nomor WhatsApp, dan catatan, lalu kirim -> Anda akan melihat halaman pembayaran QRIS dan nomor tiket berstatus *Menunggu Konfirmasi*.
4. Cek menu **Pesanan Anda** di Navbar (`/orders`) untuk melihat daftar tiket Anda.
5. Login sebagai admin (`admin@gmail.com`) dan buka **Pesanan** di `/admin/orders`, lalu klik **Konfirmasi Pembayaran** (atau coba tombol **Hubungi via WhatsApp**).
6. Kembali ke akun pembeli dan segarkan **Pesanan Anda**: pesan selamat bahwa pembayaran dikonfirmasi akan tampil!
