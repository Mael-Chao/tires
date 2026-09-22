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

const SITE_URL = "https://tires-ruddy.vercel.app"; // sin slash final
const OG_IMAGE = "/Op1.jpg"; // ver nota abajo sobre tamaño 1200x630

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Golden Tires",
  image: `${SITE_URL}${OG_IMAGE}`,
  telephone: "+13053334411",
  address: {
    "@type": "PostalAddress",
    streetAddress: "581 W 28th St",
    addressLocality: "Hialeah",
    addressRegion: "FL",
    postalCode: "33010",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.8473915,
    longitude: -80.2938876,
  },
  url: SITE_URL,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "16:00",
    },
  ],
  sameAs: ["https://www.instagram.com/goldentires_/"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}