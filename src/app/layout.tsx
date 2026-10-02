import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "lenis/dist/lenis.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ProductPanel } from "@/components/product/ProductPanel";
import { Finale } from "@/components/site/Finale";
import { Header } from "@/components/site/Header";
import { MobileCartBar } from "@/components/site/MobileCartBar";
import { Toast } from "@/components/ui/Toast";
import { site } from "@/lib/site";
import { stores } from "@/lib/stores";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000"),
  title: {
    default: `${site.name} · ${site.slogan}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: site.name,
    title: `${site.name} · ${site.slogan}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": stores.map((store) => ({
    "@type": "Restaurant",
    name: `${site.name} · ${store.name}`,
    servesCuisine: ["Sandwichs", "Burgers", "Street food"],
    priceRange: "6 – 52 DH",
    telephone: "+212522344026",
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: site.city,
      addressCountry: "MA",
    },
    geo: { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng },
    hasMenu: "/menu",
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${montserrat.variable} antialiased`}>
      <body className="font-sans">
        <a
          href="#contenu"
          className="sr-only z-[100] rounded-btn bg-paper px-4 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <SmoothScroll />
        <Header />
        <main id="contenu">{children}</main>
        <Finale />
        <MobileCartBar />
        <ProductPanel />
        <Toast />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
