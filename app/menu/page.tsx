import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import MenuShell from "@/components/menu/MenuShell";
import StaticMenuShowcase from "@/components/site/StaticMenuShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu · Canary Inn Hazaribagh",
  description:
    "Browse the full Canary Inn menu — Indian, Chinese and continental favourites. Multi-cuisine kitchen in Hazaribagh, Jharkhand.",
  alternates: { canonical: "/menu" },
  robots: { index: true, follow: true },
};

export default function MenuPage({
  searchParams,
}: {
  searchParams: { tableToken?: string };
}) {
  // No table token → public-facing static menu showcase (works without backend).
  // With token → live QR ordering shell (requires backend).
  if (!searchParams.tableToken) {
    return (
      <SmoothScroll>
        <Header />
        <main className="relative pt-24 lg:pt-32">
          <StaticMenuShowcase />
        </main>
        <Footer />
      </SmoothScroll>
    );
  }

  return <MenuShell initialToken={searchParams.tableToken} />;
}