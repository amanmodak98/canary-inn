import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import GalleryGrid from "@/components/site/GalleryGrid";
import { GALLERY } from "@/data/gallery";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: `A photo tour of ${HOTEL.name} ${HOTEL.address.city}.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        <section className="pt-32 lg:pt-40 pb-16">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Gallery"
              title="A tour of the"
              italicWord="property."
            />
          </div>
        </section>

        <section className="pb-32">
          <div className="container-tight">
            <GalleryGrid items={GALLERY} />
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}