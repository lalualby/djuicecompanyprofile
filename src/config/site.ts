export interface ProductItem {
  id: string;
  name: string;
  category: string;
  volume: string;
  price: number;
  rating: number;
  description: string;
  ingredients: string[];
  tag: string;
  colorScheme: {
    bg: string;
    bottleBg: string;
    accent: string;
  };
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
}

export const siteConfig = {
  name: "D'Juice",
  legalName: "PT D'Juice Nutrisi Indonesia",
  industry: "Artisan Cold Fresh Juice",
  tagline: "Segarkan Harimu dengan Kebaikan Murni Alami dari Sari Buah Pilihan",
  story: {
    summary:
      "D'Juice berawal dari pengalaman personal sang owner yang sempat mengeluhkan rasa sakit dan kelebihan berat badan. Ketika mulai meracik dan rutin mengonsumsi sari buah segar alami, keluhan kesehatan tersebut berangsur pudar. Terinspirasi dari pemulihan itu, D'Juice resmi beroperasi sejak tahun 2022 untuk menghadirkan jus kualitas artisan 100% murni tanpa setetes air atau gula tambahan.",
    foundedYear: "2022",
    mission:
      "Menyajikan nutrisi hidup dengan teknologi slow cold-press hidrolik agar enzim aktif, vitamin, dan antioksidan alami terjaga sempurna untuk mendukung gaya hidup sehat aktif masyarakat.",
  },
  contact: {
    phone: "+62 812-3456-7890",
    whatsapp: "6281234567890",
    email: "halo@djuice.co.id",
    address:
      "Jl. Aljauhari No.115, RT.11/RW.3, Kalisari, Kec. Ps. Rebo, Kota Jakarta Timur, DKI Jakarta 13790",
    hours: "Setiap Hari: 07.00 – 21.00 WIB (Pengiriman mulai 06.30 WIB)",
    googleMapsUrl: "https://maps.app.goo.gl/KvhoL7op5Fim8Mqk9",
    // Embed Google Maps akurat sesuai koordinat link Google Maps
    googleMapsEmbed:
      "https://maps.google.com/maps?q=-6.3329757,106.850539&hl=id&z=17&output=embed",
  },
  assets: {
    logo: "/images/logo.png",
    heroImage: "/images/hero-bottles.png",
    aboutImage: "/images/about-fruits.png",
    qrisImage: "/images/qris.jpg",
  },
  stats: [
    { label: "Botol Terkirim", value: "15.000+" },
    { label: "Rating Pelanggan", value: "4.9/5" },
    { label: "Organik & Murni", value: "100%" },
    { label: "Tahun Beroperasi", value: "Sejak 2022" },
  ],
  navLinks: [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "Menu Varian", href: "#menu-varian" },
    { label: "Paket & Layanan", href: "#layanan-produk" },
    { label: "Kabar Sehat", href: "#kabar-sehat" },
    { label: "Kontak", href: "#kontak" },
  ],
  products: [
    {
      id: "green-revive",
      name: "Green Revive",
      category: "Detox & Liver",
      volume: "350 ml",
      price: 38000,
      rating: 4.9,
      description: "Kale organik, Bayam segar, Apel Malang, Timun hidroponik, dan Perasan Lemon Segar.",
      ingredients: ["Kale Organik", "Bayam", "Apel Malang", "Timun", "Lemon"],
      tag: "Detox & Liver",
      colorScheme: {
        bg: "bg-surface-cream",
        bottleBg: "bg-emerald-600",
        accent: "text-emerald-700",
      },
    },
    {
      id: "golden-glow",
      name: "Golden Glow",
      category: "Immune Defense",
      volume: "350 ml",
      price: 40000,
      rating: 4.9,
      description: "Wortel Organik pilihan, Jeruk Pontianak manis, Jahe Emprit segar, dan Kunyit alami.",
      ingredients: ["Wortel Organik 30%", "Jeruk Manis 55%", "Jahe & Kunyit 15%"],
      tag: "Immune Defense",
      colorScheme: {
        bg: "bg-amber-50",
        bottleBg: "bg-amber-500",
        accent: "text-amber-700",
      },
    },
    {
      id: "berry-blast",
      name: "Berry Blast",
      category: "Antioksidan",
      volume: "350 ml",
      price: 45000,
      rating: 5.0,
      description: "Stroberi Ciwidey ranum, Beetroot kaya zat besi, Apel Fuji renyah, dan Organic Chia Seed.",
      ingredients: ["Stroberi Ciwidey", "Beetroot", "Apel Fuji", "Chia Seed"],
      tag: "Antioksidan",
      colorScheme: {
        bg: "bg-rose-50",
        bottleBg: "bg-rose-600",
        accent: "text-rose-700",
      },
    },
    {
      id: "citrus-sunshine",
      name: "Citrus Sunshine",
      category: "Hidrasi Segar",
      volume: "350 ml",
      price: 38000,
      rating: 4.8,
      description: "Jeruk Baby manis, Nanas madu Subang, Daun Mint aromatik, dan Air Kelapa murni.",
      ingredients: ["Jeruk Baby", "Nanas Subang", "Mint", "Air Kelapa"],
      tag: "Hidrasi Segar",
      colorScheme: {
        bg: "bg-orange-50",
        bottleBg: "bg-orange-400",
        accent: "text-orange-700",
      },
    },
    {
      id: "almond-cream-nut",
      name: "Almond Cream Nut",
      category: "Plant Protein",
      volume: "350 ml",
      price: 48000,
      rating: 4.9,
      description: "Raw Activated Almond, Medjool Dates premium, Himalayan Pink Salt, dan ekstrak Vanila asli.",
      ingredients: ["Raw Almond", "Kurma Medjool", "Himalayan Salt", "Vanilla"],
      tag: "Plant Protein",
      colorScheme: {
        bg: "bg-stone-100",
        bottleBg: "bg-stone-300",
        accent: "text-stone-700",
      },
    },
    {
      id: "pure-celery-booster",
      name: "Pure Celery Booster",
      category: "Pure Cleanse",
      volume: "350 ml",
      price: 42000,
      rating: 4.7,
      description: "100% Batang Seledri Stik Organik dipadukan dengan percikan jeruk nipis segar penyeimbang rasa.",
      ingredients: ["Seledri Stik Organik 95%", "Jeruk Nipis 5%"],
      tag: "Pure Cleanse",
      colorScheme: {
        bg: "bg-lime-50",
        bottleBg: "bg-lime-500",
        accent: "text-lime-700",
      },
    },
  ],
  services: [
    {
      title: "Paket Detox & Cleanse",
      badge: "Detox & Imun",
      description: "Program terstruktur 3 hingga 7 hari untuk me-reset saluran pencernaan, melancarkan metabolisme, disertai panduan jadwal minum dari nutrisionis.",
      price: "Mulai Rp 280.000",
      icon: "spa",
    },
    {
      title: "Langganan Harian (Office & Home)",
      badge: "Rutin Mingguan",
      description: "Pengiriman botol dingin terjadwal setiap pagi ke kantor atau tempat tinggal Anda. Pilihan varian dapat dikustomisasi sesuai selera.",
      price: "Mulai Rp 45.000/hari",
      icon: "calendar",
    },
    {
      title: "Catering & Corporate Event",
      badge: "Event B2B",
      description: "Pop-up juice bar estetik dengan barista profesional dan pasokan botol chilled untuk seminar, pertemuan direksi, atau perayaan kantor.",
      price: "Penawaran Kustom",
      icon: "briefcase",
    },
    {
      title: "Immunity & Energy Booster",
      badge: "Stamina Booster",
      description: "Formulasi padat rimpang jahe emprit, kunyit asam, apel malang, dan lemon segar untuk merevitalisasi kebugaran harian secara cepat.",
      price: "Rp 48.000 / botol",
      icon: "zap",
    },
  ],
  articles: [
    {
      id: "5-tanda-tubuh-perlu-detox",
      title: "5 Tanda Tubuh Anda Memerlukan Detoksifikasi Alami",
      category: "Tips Detox",
      date: "24 Oktober 2024",
      readTime: "4 mnt baca",
      excerpt: "Mengenali kelelahan kronis, kulit kusam, dan bagaimana formula sayuran hijau memulihkan kesegaran tubuh dengan cepat.",
      image: "/images/about-fruits.png",
    },
    {
      id: "kenapa-slow-cold-press-lebih-unggul",
      title: "Mengapa Slow Cold-Press Jauh Lebih Unggul dari Blender Biasa?",
      category: "Edukasi Nutrisi",
      date: "18 Oktober 2024",
      readTime: "5 mnt baca",
      excerpt: "Perbedaan mendasar antara proses sentrifugal berkecepatan tinggi yang merusak enzim dengan tekanan hidrolik lambat tanpa panas.",
      image: "/images/hero-bottles.png",
    },
    {
      id: "keseimbangan-metabolisme-urban",
      title: "Menjaga Keseimbangan Metabolisme di Tengah Kesibukan Urban",
      category: "Gaya Hidup",
      date: "10 Oktober 2024",
      readTime: "3 mnt baca",
      excerpt: "Langkah sederhana menggantikan asupan gula dan kafein harian dengan segelas nutrisi hidup segar di sela jam kerja.",
      image: "/images/about-fruits.png",
    },
  ],
  socials: [
    { name: "Instagram", url: "https://instagram.com" },
    { name: "WhatsApp", url: "https://wa.me/6281234567890" },
    { name: "TikTok", url: "https://tiktok.com" },
    { name: "YouTube", url: "https://youtube.com" },
  ],
};

