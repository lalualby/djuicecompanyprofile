import fs from "fs";
import path from "path";

export type TableName = "Roles" | "Users" | "News" | "Orders";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "djuice_secret_key_2026";

// Path untuk local fallback DB
const LOCAL_DATA_DIR = path.join(process.cwd(), "src", "data");
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, "db.json");

// Inisiasi file lokal jika belum ada
function getLocalDb() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LOCAL_DB_FILE)) {
    const initialData = {
      Roles: [
        {
          id: "role-admin",
          name: "admin",
          description: "Administrator Sistem dengan hak akses penuh dashboard",
          permissions: "all",
          is_system: "true",
          created_at: new Date().toISOString(),
        },
        {
          id: "role-user",
          name: "user",
          description: "Pengguna standar / customer D'Juice",
          permissions: "read",
          is_system: "true",
          created_at: new Date().toISOString(),
        },
      ],
      Users: [
        {
          id: "user-admin-default",
          name: "Administrator D'Juice",
          email: "admin@gmail.com",
          // bcrypt hash untuk '123456'
          password_hash: "$2b$10$H3uhWlVcj7dtcrNhUKozVOnLOPBVGRH8PPoLHfgLoFhESVLxk9ZtS",
          role_id: "role-admin",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      News: [
        {
          id: "news-1",
          title: "5 Tanda Tubuh Anda Memerlukan Detoksifikasi Alami",
          slug: "5-tanda-tubuh-memerlukan-detoksifikasi-alami",
          excerpt:
            "Mengenali kelelahan kronis, kulit kusam, dan bagaimana formula sayuran hijau memulihkan kesegaran tubuh dengan cepat.",
          content:
            "Tubuh manusia secara konstan memproses racun lingkungan dan makanan olahan. Ketika metabolisme melambat, gejala seperti sering lemas, mengantuk setelah makan, dan masalah pencernaan mulai muncul. Mengonsumsi jus sayuran hijau murni membantu mempercepat regenerasi sel hati.",
          thumbnail_path: "/images/about-fruits.png",
          status: "published",
          author_id: "user-admin-default",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "news-2",
          title: "Mengapa Slow Cold-Press Jauh Lebih Unggul dari Blender Biasa?",
          slug: "mengapa-slow-cold-press-lebih-unggul",
          excerpt:
            "Perbedaan mendasar antara proses sentrifugal berkecepatan tinggi yang merusak enzim dengan tekanan hidrolik lambat tanpa panas.",
          content:
            "Metode slow cold-press hidrolik menekan bahan baku tanpa bilah berputar cepat. Ini mencegah panas friksi yang biasanya mengoksidasi vitamin C dan merusak struktur enzim hidup pada buah segar.",
          thumbnail_path: "/images/hero-bottles.png",
          status: "published",
          author_id: "user-admin-default",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "news-3",
          title: "Menjaga Keseimbangan Metabolisme di Tengah Kesibukan Urban",
          slug: "menjaga-keseimbangan-metabolisme-urban",
          excerpt:
            "Langkah sederhana menggantikan asupan gula dan kafein harian dengan segelas nutrisi hidup segar di sela jam kerja.",
          content:
            "Gaya hidup modern sering kali membuat kita mengandalkan kafein dan gula cepat serap untuk energi instan. Padahal, nutrisi murni dari bit, apel, dan wortel memberikan energi stabil tanpa efek sugar crash.",
          thumbnail_path: "/images/about-fruits.png",
          status: "published",
          author_id: "user-admin-default",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      Orders: [],
    };
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  try {
    const raw = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { Roles: [], Users: [], News: [], Orders: [] };
  }
}

function saveLocalDb(data: any) {
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2));
}

/**
 * Panggil Google Apps Script via HTTP POST
 */
async function callAppsScript(action: string, table: string, extra: any = {}) {
  if (!APPS_SCRIPT_URL) {
    throw new Error("APPS_SCRIPT_URL_NOT_SET");
  }

  const payload = {
    action,
    table,
    secret: APPS_SCRIPT_SECRET,
    ...extra,
  };

  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Apps Script Error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json.data;
}

// ============================================
// Public Database API Interface
// ============================================

export async function getRecords<T = any>(table: TableName): Promise<T[]> {
  try {
    if (APPS_SCRIPT_URL) {
      return await callAppsScript("getRecords", table);
    }
  } catch (err: any) {
    console.warn(`[DB] Fallback ke local DB: ${err.message}`);
  }

  const db = getLocalDb();
  return (db[table] || []) as T[];
}

export async function getRecordById<T = any>(
  table: TableName,
  id: string
): Promise<T | null> {
  try {
    if (APPS_SCRIPT_URL) {
      return await callAppsScript("getRecordById", table, { id });
    }
  } catch (err: any) {
    console.warn(`[DB] Fallback ke local DB: ${err.message}`);
  }

  const db = getLocalDb();
  const list = db[table] || [];
  return (list.find((item: any) => String(item.id) === String(id)) || null) as T | null;
}

export async function insertRecord<T = any>(
  table: TableName,
  data: any
): Promise<any> {
  const itemWithMeta: any = {
    ...data,
    id: (data as any).id || `${table.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    if (APPS_SCRIPT_URL) {
      return await callAppsScript("insertRecord", table, { data: itemWithMeta });
    }
  } catch (err: any) {
    console.warn(`[DB] Fallback ke local DB: ${err.message}`);
  }

  const db = getLocalDb();
  if (!db[table]) db[table] = [];
  db[table].push(itemWithMeta);
  saveLocalDb(db);
  return itemWithMeta as T;
}

export async function updateRecord<T = any>(
  table: TableName,
  id: string,
  data: Partial<T>
): Promise<T> {
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  try {
    if (APPS_SCRIPT_URL) {
      return await callAppsScript("updateRecord", table, { id, data: updatePayload });
    }
  } catch (err: any) {
    console.warn(`[DB] Fallback ke local DB: ${err.message}`);
  }

  const db = getLocalDb();
  const list = db[table] || [];
  const index = list.findIndex((item: any) => String(item.id) === String(id));
  if (index === -1) {
    throw new Error(`Data dengan ID ${id} tidak ditemukan di tabel ${table}.`);
  }

  const updated = { ...list[index], ...updatePayload };
  list[index] = updated;
  saveLocalDb(db);
  return updated as T;
}

export async function deleteRecord(table: TableName, id: string): Promise<boolean> {
  try {
    if (APPS_SCRIPT_URL) {
      await callAppsScript("deleteRecord", table, { id });
      return true;
    }
  } catch (err: any) {
    console.warn(`[DB] Fallback ke local DB: ${err.message}`);
  }

  const db = getLocalDb();
  const list = db[table] || [];
  const index = list.findIndex((item: any) => String(item.id) === String(id));
  if (index === -1) {
    throw new Error(`Data dengan ID ${id} tidak ditemukan.`);
  }

  list.splice(index, 1);
  saveLocalDb(db);
  return true;
}
