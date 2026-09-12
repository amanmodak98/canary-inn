import Link from "next/link";
import { ArrowRight, Wine, UtensilsCrossed, Music2 } from "lucide-react";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import ImageReveal from "@/components/site/ImageReveal";
import CTASection from "@/components/site/CTASection";
import { IMAGES } from "@/data/images";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dining",
  description: `The ${HOTEL.name} multi-cuisine restaurant, bar and lounge in ${HOTEL.address.city}.`,
  alternates: { canonical: "/dining" },
};

const SIGNATURES = [
  {
    name: "Butter Chicken",
    desc: "Tandoori chicken simmered in a creamy tomato gravy.",
    price: 340,
    veg: false,
    image: IMAGES.dining.indian,
  },
  {
    name: "Chicken Biryani",
    desc: "Long-grained basmati layered with chicken and aromatics.",
    price: 320,
    veg: false,
    image: IMAGES.dining.biryani,
  },
  {
    name: "Paneer Butter Masala",
    desc: "Cubes of paneer in a rich tomato-camel gravy.",
    price: 280,
    veg: true,
    image: IMAGES.dining.thali,
  },
  {
    name: "Veg Manchurian",
    desc: "Glossy Indo-Chinese dumplings.",
    price: 220,
    veg: true,
    image: IMAGES.dining.chinese,
  },
];

export default function DiningPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        {/* Hero */}
        <section className="pt-32 lg:pt-40">
          <div className="container-tight grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="eyebrow">Dining at Canary Inn</div>
                <h1 className="mt-3 text-display-lg lg:text-display-xl text-coal leading-[0.95]">
                  A multi-cuisine kitchen and a Hazaribagh favourite for{" "}
                  <em className="display-italic not-italic text-ember">live evenings</em>.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-xl text-coal/75 text-lg leading-relaxed">
                  An in-house restaurant serving Indian, Chinese and continental favourites. Our bar and lounge is known across the city for live performances and casual evenings.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/menu" className="btn-primary">
                    Explore Menu <ArrowRight size={16} />
                  </Link>
                  <Link href="/menu" className="btn-secondary">
                    Order from Your Table
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <ImageReveal src={IMAGES.dining.restaurant} alt="Restaurant at Canary Inn" aspect="aspect-[4/5]" priority />
            </div>
          </div>
        </section>

        {/* Three pillars */}
        <section className="section">
          <div className="container-tight grid md:grid-cols-3 gap-10">
            {[
              { icon: UtensilsCrossed, title: "The Restaurant", desc: "Indian, Chinese and continental — open from breakfast through dinner." },
              { icon: Wine, title: "Bar & Lounge", desc: "House cocktails, premium spirits and a Hazaribagh evening ritual." },
              { icon: Music2, title: "Live Music", desc: "Performances and weekend gatherings — our lounge hosts it all." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <p.icon size={28} strokeWidth={1.25} className="text-ember" />
                <h3 className="mt-5 font-serif text-2xl text-coal">{p.title}</h3>
                <p className="mt-2 text-coal/65 leading-relaxed">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Signature dishes */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Signature dishes"
              title="A few of our"
              italicWord="favourites."
            />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {SIGNATURES.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.06}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                    <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-ivory/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] uppercase tracking-widest">
                      {s.veg ? "Veg" : "Non-veg"}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-serif text-xl text-coal">{s.name}</h3>
                    <p className="mt-1 text-sm text-coal/65">{s.desc}</p>
                    <div className="mt-3 font-serif text-lg text-coal">₹{s.price}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Hours + ambience */}
        <section className="section">
          <div className="container-tight grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 grid grid-cols-12 gap-4">
              <ImageReveal src={IMAGES.dining.chef} alt="Canary Inn kitchen" className="col-span-7" aspect="aspect-[4/5]" />
              <ImageReveal src={IMAGES.dining.barLounge} alt="Bar lounge" className="col-span-5 mt-12" aspect="aspect-[3/4]" />
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <div className="eyebrow">Hours</div>
                <h2 className="mt-3 text-display-md text-coal">
                  From breakfast to{" "}
                  <span className="display-italic">last call</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <dl className="mt-8 grid grid-cols-2 gap-y-5 text-sm border-t border-coal/15 pt-6">
                  <dt className="text-ash uppercase tracking-widest text-eyebrow">Restaurant</dt>
                  <dd className="text-coal">{HOTEL.timings.restaurant}</dd>
                  <dt className="text-ash uppercase tracking-widest text-eyebrow">Bar</dt>
                  <dd className="text-coal">{HOTEL.timings.bar}</dd>
                  <dt className="text-ash uppercase tracking-widest text-eyebrow">Cuisine</dt>
                  <dd className="text-coal">Indian · Chinese · Continental</dd>
                  <dt className="text-ash uppercase tracking-widest text-eyebrow">Average</dt>
                  <dd className="text-coal">₹500 for two</dd>
                </dl>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/menu" className="btn-primary">See the full menu</Link>
                  <a href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`} className="btn-secondary">Call to reserve</a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <CTASection
          eyebrow="Order from your table"
          title="Skip the queue. Scan, choose, eat."
          subtitle="Every restaurant table at Canary Inn has its own QR. Open the menu, order, and the kitchen sees it in seconds."
          primary={{ label: "Open the menu", href: "/menu" }}
          secondary={{ label: "How QR ordering works", href: "/menu#how-it-works" }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}