import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import AmenityCard from "@/components/site/AmenityCard";
import Reveal from "@/components/site/Reveal";
import ImageReveal from "@/components/site/ImageReveal";
import CTASection from "@/components/site/CTASection";
import { AMENITIES } from "@/data/amenities";
import { IMAGES } from "@/data/images";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience & Amenities",
  description: `Hotel amenities at ${HOTEL.name} ${HOTEL.address.city}. Restaurant, bar, conference rooms, business centre and more.`,
  alternates: { canonical: "/experience" },
};

const HIGHLIGHTS = [
  { title: "Conference-ready", desc: "Two conference rooms and a business centre for the working traveller.", image: IMAGES.amenities.conference },
  { title: "Live music nights", desc: "Our lounge is one of the city's most-loved venues for performances and casual evenings.", image: IMAGES.gallery.bar },
  { title: "Always-on service", desc: "24-hour front desk, room service, doctor on call and on-site parking.", image: IMAGES.gallery.service },
];

export default function ExperiencePage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        <section className="pt-32 lg:pt-40 pb-20">
          <div className="container-tight">
            <SectionHeading
              eyebrow="The experience"
              title="Considered, never"
              italicWord="overstated."
              subtitle="The details that make a stay feel easy — and the kitchen, bar and lounge that make an evening feel right."
            />
          </div>
        </section>

        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading eyebrow="Amenities" title="Everything you need" italicWord="on-site." />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {AMENITIES.map((a, i) => (
                <AmenityCard key={a.name} {...a} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-tight">
            <SectionHeading eyebrow="Highlights" title="A few things we do" italicWord="particularly well." />
            <div className="mt-14 grid md:grid-cols-3 gap-8">
              {HIGHLIGHTS.map((h, i) => (
                <Reveal key={h.title} delay={i * 0.08}>
                  <ImageReveal src={h.image} alt={h.title} aspect="aspect-[4/5]" />
                  <h3 className="mt-5 font-serif text-2xl text-coal">{h.title}</h3>
                  <p className="mt-2 text-coal/65 leading-relaxed">{h.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-coal text-ivory">
          <div className="container-tight grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="eyebrow text-ember">In the area</div>
                <h2 className="mt-3 text-display-md text-ivory">
                  Hazaribagh, in the hills of Jharkhand.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-ivory/75 text-lg leading-relaxed max-w-2xl">
                  The town is known for the Hazaribagh National Park, the lake, and the famous Canary Hill — a quiet vantage point at sunset. The hotel is on NH-33, a short drive from the railway station and well connected to Ranchi and Patna.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.2}>
                <ul className="space-y-3 text-sm text-ivory/85">
                  {HOTEL.nearby.map((n) => (
                    <li key={n} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                      {n}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <CTASection
          title="Plan a stay, or simply walk in for dinner."
          primary={{ label: "Contact the hotel", href: "/contact" }}
          secondary={{ label: "Explore rooms", href: "/rooms" }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}