"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  thumbnail_path: string;
  category?: string;
  created_at?: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setArticles(json.data);
        } else {
          // Fallback ke default siteConfig jika belum ada data di database
          setArticles(
            siteConfig.articles.map((a) => ({
              id: a.id,
              title: a.title,
              excerpt: a.excerpt,
              thumbnail_path: a.image,
              category: a.category,
              created_at: a.date,
            }))
          );
        }
      })
      .catch(() => {
        // Fallback default
        setArticles(
          siteConfig.articles.map((a) => ({
            id: a.id,
            title: a.title,
            excerpt: a.excerpt,
            thumbnail_path: a.image,
            category: a.category,
            created_at: a.date,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="kabar-sehat" className="w-full bg-surface py-16 lg:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              KABAR SEHAT & EDUKASI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
              Inspirasi & Edukasi Gaya Hidup Sehat
            </h2>
          </div>
          <Link
            href="#kabar-sehat"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-secondary hover:text-primary transition-colors"
          >
            <span>Semua Artikel</span>
            <span className="material-symbols-outlined text-[18px]">
              north_east
            </span>
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art, idx) => (
            <article
              key={art.id || idx}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-container group"
            >
              <div className="relative w-full h-52 overflow-hidden bg-surface-cream">
                <Image
                  src={art.thumbnail_path || "/images/about-fruits.png"}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-secondary font-bold text-xs shadow-sm border border-secondary/10">
                    {art.category || "Edukasi Sehat"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                    <span>
                      {art.created_at
                        ? art.created_at.includes("-")
                          ? new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : art.created_at
                        : "Terbaru"}
                    </span>
                    <span>•</span>
                    <span>4 mnt baca</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                    <span>Baca Selengkapnya</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
