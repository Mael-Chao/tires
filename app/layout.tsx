import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://tires-ruddy.vercel.app/"; // reemplazar por el dominio final
const OG_IMAGE = "/Op1.jpg"; // 1200x630, poner una foto real del local aquí

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Golden Tires | Llantas y Rines en Hialeah",
  description:
    "Llantas, rines, montaje, balanceo y alineación en Hialeah. Cotiza tu medida y te respondemos rápido. 581 W 28th St, Hialeah, FL.",
  keywords: [
    "llantas Hialeah",
    "rines Hialeah",
    "gomera Hialeah",
    "tire shop Hialeah",
    "montaje de llantas Miami",
    "balanceo y alineación Miami",
  ],
  authors: [{ name: "Golden Tires" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: SITE_URL,
    siteName: "Golden Tires",
    title: "Golden Tires | Llantas y Rines en Hialeah",
    description:
      "Llantas, rines y montaje en Hialeah. Cotiza tu medida y te respondemos rápido.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Golden Tires - Llantas y rines en Hialeah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Tires | Llantas y Rines en Hialeah",
    description: "Llantas, rines y montaje en Hialeah.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
