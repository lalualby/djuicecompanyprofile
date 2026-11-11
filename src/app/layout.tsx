import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Cold Fresh Juice & Artisan Wellness`,
  description: siteConfig.tagline,
  keywords: [
    "D'Juice",
    "Cold Fresh Juice",
    "Jus Buah Segar",
    "Cold-Pressed Juice Jakarta",
    "Jus Organik Jakarta",
    "Cold Fresh Juice Kalisari",
    "Detox Cleanse",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - Sari Buah Segar Murni Alami`,
    description: siteConfig.story.summary,
    url: "https://djuice.co.id",
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans bg-surface text-on-surface antialiased min-h-screen selection:bg-primary-container selection:text-white">
        {children}
      </body>
    </html>
  );
}
