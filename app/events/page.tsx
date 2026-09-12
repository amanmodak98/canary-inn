import Link from "next/link";
import { ArrowRight, Briefcase, Presentation, Users, Sparkles, Phone } from "lucide-react";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import ImageReveal from "@/components/site/ImageReveal";
import CTASection from "@/components/site/CTASection";
import { HOTEL } from "@/lib/hotel";
import { VENUES, EVENT_TYPES, EVENT_TIMELINE, CATERING_NOTES } from "@/data/events";
import type { Metadata } from "next";

const ICONS: Record<string, any> = {
  Sparkles,
  Briefcase,
  Presentation,
  Users,
};

export const metadata: Metadata = {
  title: "Events & Banquets",
  description: `Banquet hall, conference room and boardroom at ${HOTEL.name} ${HOTEL.address.city}. Weddings, corporate offsites, conferences and social gatherings.`,
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        {/* Hero */}
        <section className="pt-32 lg:pt-40 pb-16">
          <div className="container-tight grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="eyebrow">Events & banquets</div>
                <h1 className="mt-3 text-display-lg lg:text-display-xl text-coal leading-[0.95]">
                  Spaces for <span className="display-italic">celebrations</span>, conferences and everything in between.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-xl text-coal/75 text-lg leading-relaxed">
                  Three venues, a multi-cuisine kitchen and a team that handles the details. Whether you're hosting 200 for a wedding or 12 for a board meeting, we'll plan it with you.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-ember">
                    Enquire about a date <ArrowRight size={16} />
                  </Link>
                  <a
                    href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`}
                    className="btn-secondary"
                  >
                    <Phone size={14} /> Call the events team
                  </a>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <ImageReveal
                src={VENUES[0].image}
                alt="Banquet Hall at Canary Inn"
                aspect="aspect-[4/5]"
                priority
              />
            </div>
          </div>
        </section>

        {/* Venues */}
        <section className="section">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Our venues"
              title="Three rooms,"
              italicWord="all sizes."
            />
            <div className="mt-14 space-y-24">
              {VENUES.map((v, i) => (
                <Reveal key={v.slug}>
                  <div
                    className={`grid lg:grid-cols-12 gap-10 items-center ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="lg:col-span-7">
                      <ImageReveal
                        src={v.image}
                        alt={v.name}
                        aspect="aspect-[5/4]"
                      />
                    </div>
                    <div className="lg:col-span-5">
                      <div className="eyebrow text-ember">{v.capacity}</div>
                      <h3 className="mt-2 font-serif text-3xl lg:text-4xl text-coal">{v.name}</h3>
                      <p className="mt-4 text-coal/75 leading-relaxed">{v.description}</p>
                      <dl className="mt-6 grid grid-cols-1 gap-y-2 text-sm border-t border-coal/15 pt-5">
                        <div className="flex justify-between">
                          <dt className="text-ash uppercase tracking-widest text-eyebrow">Layout</dt>
                          <dd className="text-coal">{v.layout}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-ash uppercase tracking-widest text-eyebrow">Starting at</dt>
                          <dd className="text-coal font-medium">{v.priceFrom}</dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {v.suitableFor.map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 bg-cream text-coal/80 text-xs uppercase tracking-widest rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8">
                        <Link href="/contact" className="btn-primary">
                          Enquire about {v.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What we host */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="What we host"
              title="From intimate dinners to"
              italicWord="grand affairs."
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {EVENT_TYPES.map((t, i) => {
                const Icon = ICONS[t.icon] ?? Sparkles;
                return (
                  <Reveal key={t.title} delay={i * 0.06}>
                    <Icon size={28} strokeWidth={1.25} className="text-ember" />
                    <h3 className="mt-5 font-serif text-2xl text-coal">{t.title}</h3>
                    <p className="mt-2 text-coal/65 leading-relaxed text-sm">{t.desc}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Catering + Timeline */}
        <section className="section">
          <div className="container-tight grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="eyebrow">Catering</div>
                <h2 className="mt-3 text-display-md text-coal">
                  A kitchen that <span className="display-italic">delivers</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="mt-8 space-y-3 text-coal/80">
                  {CATERING_NOTES.map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ember shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <div className="eyebrow">How it works</div>
                <h2 className="mt-3 text-display-md text-coal">
                  From <span className="display-italic">enquiry</span> to execution.
                </h2>
              </Reveal>
              <ol className="mt-8 space-y-6">
                {EVENT_TIMELINE.map((s, i) => (
                  <Reveal as="li" key={s.step} delay={i * 0.05} className="flex gap-5">
                    <div className="font-serif text-2xl text-ember/70 shrink-0 w-10">{s.step}</div>
                    <div>
                      <div className="font-serif text-lg text-coal">{s.title}</div>
                      <p className="text-sm text-coal/65 leading-relaxed mt-1">{s.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <CTASection
          eyebrow="Plan your event"
          title="Tell us your date. We'll handle the rest."
          subtitle="A dedicated event manager will be in touch within the hour with availability and a tailored quote."
          primary={{ label: "Enquire now", href: "/contact" }}
          secondary={{
            label: HOTEL.contact.phoneDisplay,
            href: `tel:${HOTEL.contact.phone.replace(/\s/g, "")}`,
          }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}