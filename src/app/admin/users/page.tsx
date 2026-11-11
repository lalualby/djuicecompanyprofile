"use client";

import { useEffect, useState } from "react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, meRes] = await Promise.all([
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/roles").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ]);

      if (uRes.success) setUsers(uRes.data || []);
      if (rRes.success) setRoles(rRes.data || []);
      if (meRes.authenticated && meRes.user) setCurrentAdminId(meRes.user.id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengubah role.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengubah status.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Hapus pengguna "${userName}" secara permanen?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus pengguna.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Manajemen Pengguna
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Kelola hak akses role dan status aktif akun pengguna D'Juice.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container shadow-sm flex items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-surface-container shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            Memuat daftar pengguna...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            Tidak ada pengguna yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-cream text-on-surface font-bold uppercase tracking-wider text-[11px] border-b border-surface-container">
                <tr>
                  <th className="py-3.5 px-4">Nama & Email</th>
                  <th className="py-3.5 px-4">Role Akses</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Terdaftar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentAdminId;
                  return (
                    <tr key={u.id} className="hover:bg-surface-cream/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface flex items-center gap-1.5">
                            {u.name}
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-secondary-container text-secondary rounded font-bold">
                                Anda
                              </span>
                            )}
                          </span>
                          <span className="text-on-surface-variant text-[11px]">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          disabled={actionLoading}
                          value={u.role_id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-low border border-surface-container font-semibold text-xs text-on-surface focus:outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          disabled={isSelf || actionLoading}
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          className={`px-3 py-1 rounded-full font-bold text-[10px] transition-colors ${
                            u.status === "active"
                              ? "bg-secondary-container text-secondary hover:bg-red-100 hover:text-red-700"
                              : "bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-secondary"
                          } ${isSelf ? "cursor-not-allowed opacity-80" : ""}`}
                          title={isSelf ? "Tidak bisa menonaktifkan akun sendiri" : "Klik untuk ubah"}
                        >
                          {u.status === "active" ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant">
                        {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {!isSelf && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Hapus Pengguna"
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

