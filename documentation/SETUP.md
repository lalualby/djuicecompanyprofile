# Panduan Pengaturan Google Spreadsheet & Google Apps Script

Dokumen ini memandu Anda menghubungkan website **D'Juice** ke **Google Spreadsheet** sebagai database utama melalui **Google Apps Script**.

---

## Mengapa Menggunakan Google Apps Script?
Aplikasi Next.js kita berkomunikasi dengan Google Spreadsheet melalui Google Apps Script Web App dengan kunci rahasia (*shared secret*). Ini memastikan spreadsheet Anda tidak bisa diakses sembarang orang langsung dari browser.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di akun Google Anda.
2. Beri judul spreadsheet: `D'Juice Database`.

---

## Langkah 2: Buka Editor Apps Script
1. Di dalam spreadsheet tersebut, klik menu **Extensions (Ekstensi)** > **Apps Script**.
2. Beri nama proyek Apps Script (di kiri atas): `D'Juice Backend API`.

---

## Langkah 3: Salin Kode `code.gs` dan `setup.gs`
1. Di file bawaan `Code.gs`:
   - Hapus semua isi default.
   - Buka file [`code.gs`](file:///c:/Users/lalua/OneDrive/Documents/File%20Belajar%20HTML%20(kelas%20x)/Company%20Profile/D'Juice/code.gs) di proyek Anda, salin seluruh kodenya, dan tempel ke `Code.gs`.
2. Klik tombol **+ (Add a file)** di sebelah kiri > pilih **Script**.
3. Beri nama file baru: `setup`.
4. Buka file [`setup.gs`](file:///c:/Users/lalua/OneDrive/Documents/File%20Belajar%20HTML%20(kelas%20x)/Company%20Profile/D'Juice/setup.gs) di proyek Anda, salin seluruh kodenya, dan tempel ke `setup.gs`.
5. Klik ikon **Simpan (Save)** (ikon disket) atau tekan `Ctrl + S`.

---

## Langkah 4: Inisiasi Tabel Otomatis
1. Di bar atas editor Apps Script, pilih fungsi **`initTables`**.
2. Klik tombol **Run (Jalankan)**.
3. Google akan meminta izin akses (*Review Permissions*):
   - Klik akun Google Anda.
   - Klik **Advanced (Lanjutan)** > **Go to D'Juice Backend API (unsafe)**.
   - Klik **Allow (Izinkan)**.
4. Buka kembali tab Google Spreadsheet Anda:
   - Sheet **Roles**, **Users**, **News**, dan **Orders** akan otomatis terbuat beserta header dan data default (termasuk admin awal). Jika Anda sudah pernah menjalankan `initTables()` sebelumnya, salin ulang isi [`setup.gs`](file:///c:/Users/lalua/OneDrive/Documents/File%20Belajar%20HTML%20(kelas%20x)/Company%20Profile/D'Juice/setup.gs) lalu jalankan `initTables()` lagi — aman karena idempoten (tidak menimpa data lama).

---

## Langkah 5: Atur Kunci Rahasia (Script Properties)
1. Di editor Apps Script, klik menu **Project Settings (Pengaturan Proyek)** (ikon gerigi di sebelah kiri).
2. Gulir ke bawah ke bagian **Script Properties**.
3. Klik **Edit script properties** > **Add script property**:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** `djuice_secret_key_2026` *(atau kata sandi rahasia panjang pilihan Anda)*
4. Klik **Save script properties**.

---

## Langkah 6: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment**.
2. Klik ikon gerigi di samping *Select type* > pilih **Web app**.
3. Isi konfigurasi:
   - **Description:** `D'Juice Production API v1`
   - **Execute as:** `Me (email-anda@gmail.com)`
   - **Who has access:** `Anyone (Siapa saja)`
4. Klik **Deploy**.
5. Salin **Web app URL** yang muncul (berformat: `https://script.google.com/macros/s/.../exec`).

---

## Langkah 7: Pasang di Proyek Website (`.env.local`)
Buat file `.env.local` di root proyek D'Juice Anda:
```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/KODE_DEPLOYMENT_ANDA/exec
APPS_SCRIPT_SECRET=djuice_secret_key_2026
SESSION_SECRET=super_secret_jwt_key_at_least_32_characters_long
```

> **Catatan Pengujian Lokal:**  
> Jika Anda belum sempat memasang Google Spreadsheet sekarang, sistem Next.js D'Juice telah dilengkapi dengan *local database fallback* otomatis di `src/data/db.json` sehingga seluruh fitur Login, Manajemen User, dan CRUD Berita tetap bisa dicoba dan diuji langsung!

