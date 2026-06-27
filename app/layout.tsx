import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import "./globals.css";

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
  title: "Eurolonas — Lonas técnicas Sauleda en Argentina",
  description:
    "Distribuidor oficial Sauleda en Argentina. Lonas acrílicas, Soltis y Cristal PVC, e insumos para toldos. Telas por metro y por rollo.",
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
