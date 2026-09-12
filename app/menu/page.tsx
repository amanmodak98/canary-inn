import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import StaticMenuShowcase from "@/components/site/StaticMenuShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu · Canary Inn Hazaribagh",
  description:
    "Browse the full Canary Inn menu — Indian, Chinese and continental favourites. Multi-cuisine kitchen in Hazaribagh, Jharkhand.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
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