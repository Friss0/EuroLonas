import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const SITE_URL = getSiteUrl();
const DESCRIPTION =
  "Distribuidor oficial Sauleda en Argentina. Lonas acrílicas, Soltis y Cristal PVC, e insumos para toldos. Telas por metro y por rollo.";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Eurolonas — Lonas técnicas Sauleda en Argentina",
  description: DESCRIPTION,
  applicationName: "Eurolonas",
  keywords: [
    "lonas",
    "lonas técnicas",
    "Sauleda",
    "toldos",
    "telas acrílicas",
    "Soltis",
    "Cristal PVC",
    "insumos para toldos",
    "tapicería náutica",
    "Argentina",
  ],
  authors: [{ name: "Eurolonas" }],
  creator: "Eurolonas",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Eurolonas",
    url: SITE_URL,
    title: "Eurolonas — Lonas técnicas Sauleda en Argentina",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Eurolonas — Lonas técnicas Sauleda en Argentina",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Favicon optimizado (encuadrado con padding transparente). El ?v fuerza a
  // los navegadores a refrescar el ícono cacheado al cambiarlo.
  icons: {
    icon: [
      { url: "/eurolonas-favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/eurolonas-favicon-256.png?v=2", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/eurolonas-favicon-32.png?v=2",
    apple: { url: "/eurolonas-favicon-180.png?v=2", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Eurolonas",
              url: SITE_URL,
              logo: `${SITE_URL}/eurolonas-favicon-256.png`,
              description: DESCRIPTION,
              areaServed: "AR",
            }),
          }}
        />
        <CartProvider>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
