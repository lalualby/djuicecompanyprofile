"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      const json = await res.json();
      if (json.success) {
        setNews(json.data || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormStatus("published");
    setFormThumbnail("/images/about-fruits.png");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormExcerpt(item.excerpt);
    setFormContent(item.content);
    setFormStatus(item.status);
    setFormThumbnail(item.thumbnail_path);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengunggah gambar.");
      }

      setFormThumbnail(json.filePath);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const method = editingItem ? "PUT" : "POST";
      const payload = {
        id: editingItem ? editingItem.id : undefined,
        title: formTitle,
        excerpt: formExcerpt,
        content: formContent,
        thumbnail_path: formThumbnail,
        status: formStatus,
      };

      const res = await fetch("/api/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan artikel.");
      }

      setIsModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menghapus berita.");
      }
      fetchNews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredNews = news.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : n.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Manajemen Berita & Artikel
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Publikasikan atau sunting konten edukasi kesehatan untuk ditampilkan di website.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau isi berita..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="published">Terpublikasi</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* News Table / List */}
      <div className="bg-white rounded-3xl border border-surface-container shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            Memuat daftar berita...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              article
            </span>
            <span className="text-sm font-semibold text-on-surface">
              Belum ada artikel ditemukan
            </span>
            <p className="text-xs text-on-surface-variant">
              Mulai buat artikel pertama Anda dengan menekan tombol "Tulis Artikel Baru".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-cream text-on-surface font-bold uppercase tracking-wider text-[11px] border-b border-surface-container">
                <tr>
                  <th className="py-3.5 px-4">Artikel</th>
                  <th className="py-3.5 px-4">Ringkasan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-cream/30 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-surface-container">
                          <Image
                            src={item.thumbnail_path || "/images/about-fruits.png"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-on-surface line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm text-on-surface-variant line-clamp-2">
                      {item.excerpt}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          item.status === "published"
                            ? "bg-secondary-container text-secondary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {item.status === "published" ? "Publik" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-on-surface-variant">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          title="Pratinjau"
                          className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            visibility
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          title="Sunting"
                          className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Hapus"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Ubah Berita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container mb-5">
              <h2 className="text-lg font-bold text-on-surface">
                {editingItem ? "Sunting Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Khasiat Buah Bit untuk Detoks Hati"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Ringkasan (Excerpt)
                </label>
                <input
                  type="text"
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Deskripsi singkat artikel untuk preview di kartu..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                />
              </div>

              {/* Upload Gambar Thumbnail */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Gambar Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  {formThumbnail && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container border border-surface-container shrink-0">
                      <Image
                        src={formThumbnail}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="text-xs text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-white hover:file:bg-primary cursor-pointer"
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {uploadingFile ? "Mengunggah..." : "JPG, PNG, atau WebP (Maks. 5 MB)."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Konten Lengkap *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tuliskan isi artikel edukasi di sini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Status Publikasi
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-none"
                >
                  <option value="published">Langsung Publikasikan (Tampil di Landing Page)</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
              </div>

              <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingFile}
                  className="px-6 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs shadow-md hover:bg-primary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Berita */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-4">
              <span className="text-xs uppercase font-bold text-secondary">
                Pratinjau Artikel
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-surface-container mb-4">
              <Image
                src={previewItem.thumbnail_path || "/images/about-fruits.png"}
                alt={previewItem.title}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl font-extrabold text-on-surface mb-2">
              {previewItem.title}
            </h2>
            <p className="text-xs text-on-surface-variant mb-4 italic">
              {previewItem.excerpt}
            </p>
            <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line border-t border-surface-container pt-4">
              {previewItem.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

