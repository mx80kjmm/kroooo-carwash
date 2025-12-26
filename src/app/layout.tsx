import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import StructuredData from "./components/StructuredData";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://kroooo.com'),
  title: "コイン洗車場検索 kroooo.com",
  description: "近くのコイン洗車場をカンタン検索。ノーブラシ洗車機や高圧洗浄機の有無で絞り込み可能。",
  keywords: ["洗車場", "コイン洗車", "ノンブラシ洗車", "セルフ洗車", "洗車機", "kroooo"],
  authors: [{ name: "kroooo.com" }],
  openGraph: {
    title: "コイン洗車場検索 kroooo.com",
    description: "近くのコイン洗車場をカンタン検索。ノーブラシ洗車機や高圧洗浄機の有無で絞り込み可能。",
    url: "https://kroooo.com",
    siteName: "kroooo.com",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "kroooo.com - 全国コイン洗車場データベース",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "コイン洗車場検索 kroooo.com",
    description: "近くのコイン洗車場をカンタン検索。ノーブラシ洗車機や高圧洗浄機の有無で絞り込み可能。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // TODO: Google Search Console で取得
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-TEP74YDNS4" />
    </html>
  );
}
