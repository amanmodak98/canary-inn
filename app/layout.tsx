import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import { HOTEL } from "@/lib/hotel";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["400", "500"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${HOTEL.name} ${HOTEL.address.city} — Hotel, Restaurant & Bar`,
    template: `%s — ${HOTEL.name} ${HOTEL.address.city}`,
  },
  description: HOTEL.description,
  keywords: [
    "Canary Inn",
    "Hazaribagh hotel",
    "Hazaribagh restaurant",
    "Jharkhand hotel",
    "NH-33 hotel",
    "Hazaribagh bar",
  ],
  openGraph: {
    title: `${HOTEL.name} ${HOTEL.address.city}`,
    description: HOTEL.description,
    type: "website",
    siteName: HOTEL.name,
  },
  twitter: { card: "summary_large_image", title: HOTEL.name },
  alternates: { canonical: SITE },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Hotel JSON-LD for SEO (only on first render — page-level structured data added per page).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL.name,
    description: HOTEL.description,
    telephone: HOTEL.contact.phone,
    email: HOTEL.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${HOTEL.address.line1}, ${HOTEL.address.line2}`,
      addressLocality: HOTEL.address.city,
      addressRegion: HOTEL.address.state,
      postalCode: HOTEL.address.pincode,
      addressCountry: HOTEL.address.country,
    },
    starRating: { "@type": "Rating", ratingValue: "3" },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Conference Rooms", value: true },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="bg-ivory text-coal font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}