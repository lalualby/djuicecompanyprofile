"use client";

import { useEffect, useState } from "react";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: string | boolean;
  created_at: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPerms, setFormPerms] = useState("read");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles");
      const json = await res.json();
      if (json.success) setRoles(json.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          description: formDesc,
          permissions: formPerms,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal membuat role.");

      setIsModalOpen(false);
      setFormName("");
      setFormDesc("");
      loadRoles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!confirm(`Hapus role "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/roles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus role.");
      loadRoles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Manajemen Role & Hak Akses
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Kelola tingkatan hak akses pengguna dalam ekosistem D'Juice.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Role Baru</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-on-surface-variant">
            Memuat daftar role...
          </div>
        ) : (
          roles.map((r) => {
            const isSystem = r.is_system === "true" || r.is_system === true;
            return (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-on-surface capitalize">
                      {r.name}
                    </span>
                    {isSystem ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                        Sistem Bawaan
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-secondary">
                        Kustom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      vpn_key
                    </span>
                    <span>Hak: <strong>{r.permissions}</strong></span>
                  </div>

                  {!isSystem && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(r.id, r.name)}
                      className="p-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Role"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Role */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-4">
              <h2 className="text-base font-bold text-on-surface">
                Tambah Role Baru
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Nama Role (Huruf kecil, tanpa spasi) *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: editor atau manager"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Deskripsi Peran
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Tanggung jawab peran ini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Tingkat Hak Izin (Permissions)
                </label>
                <select
                  value={formPerms}
                  onChange={(e) => setFormPerms(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none"
                >
                  <option value="read">Hanya Baca (Read-only)</option>
                  <option value="read_write">Tulis & Baca Konten (Editor)</option>
                  <option value="manage">Pengelola Penuh (Manager)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

