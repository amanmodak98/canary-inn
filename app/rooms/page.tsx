import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import RoomCard from "@/components/site/RoomCard";
import Reveal from "@/components/site/Reveal";
import CTASection from "@/components/site/CTASection";
import { ROOMS } from "@/data/rooms";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: `Rooms and suites at ${HOTEL.name} ${HOTEL.address.city}. Standard, Deluxe, Super Deluxe and the signature Canary Suite.`,
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        <section className="pt-40 lg:pt-48 pb-20">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Rooms & suites"
              title="A bed for every"
              italicWord="occasion."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-coal/70 text-lg leading-relaxed">
                Four categories, finished for warmth and a good night's sleep. Tap any room for the full picture — pricing varies by channel; reserve directly with us or via your favourite platform.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-tight grid md:grid-cols-2 gap-10 lg:gap-12">
            {ROOMS.map((r, i) => (
              <RoomCard key={r.slug} room={r} index={i} />
            ))}
          </div>
        </section>

        <CTASection
          eyebrow="Plan your stay"
          title="From short stops to long weeks, we have a room for it."
          primary={{ label: "Contact the hotel", href: "/contact" }}
          secondary={{ label: "Browse booking channels", href: "/contact#channels" }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}