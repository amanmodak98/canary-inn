import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import MenuShell from "@/components/menu/MenuShell";
import StaticMenuShowcase from "@/components/site/StaticMenuShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu · Category",
  robots: { index: false, follow: false },
};

// Deep-link to a category on the static showcase, or hand off to live ordering shell with token.
export default function MenuCategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { tableToken?: string };
}) {
  if (!searchParams.tableToken) {
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

  return <MenuShell initialToken={searchParams.tableToken} />;
}