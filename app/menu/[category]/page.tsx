import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import StaticMenuShowcase from "@/components/site/StaticMenuShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu · Category",
};

// Deep-link to a category on the static showcase.
export default function MenuCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative pt-24 lg:pt-32">
        <StaticMenuShowcase initialCategory={params.category} />
      </main>
      <Footer />
    </SmoothScroll>
  );
}