import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import CTASection from "@/components/site/CTASection";
import { OFFERS } from "@/data/offers";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers & Packages",
  description: `Seasonal offers and stay packages at ${HOTEL.name} ${HOTEL.address.city}. Weekend stays, romantic escapes, business traveller packages and more.`,
  alternates: { canonical: "/offers" },
};

export default function OffersPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        {/* Hero */}
        <section className="pt-32 lg:pt-40 pb-12">
          <div className="container-tight">
            <Reveal>
              <div className="eyebrow">Offers & packages</div>
              <h1 className="mt-3 text-display-lg lg:text-display-xl text-coal leading-[0.95] max-w-4xl">
                Seasonal <span className="display-italic">offers</span>, considered packages.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-coal/75 text-lg leading-relaxed">
                Stay-and-dine combinations, romantic escapes and packages for the working traveller. Direct bookings include complimentary breakfast and the best available rate.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Offers — alternating editorial layout */}
        <section className="pb-12">
          <div className="space-y-24 lg:space-y-32">
            {OFFERS.map((offer, i) => {
              const reverse = i % 2 === 1;
              return (
                <Reveal key={offer.slug}>
                  <div className="container-tight">
                    <div
                      className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                        reverse ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      <div className="lg:col-span-7 relative aspect-[5/4] overflow-hidden bg-cream group">
                        <Image
                          src={offer.image}
                          alt={offer.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                        />
                        {offer.badge && (
                          <div className="absolute top-4 left-4 bg-coal text-ivory px-3 py-1.5 rounded-full text-eyebrow uppercase tracking-widest">
                            {offer.badge}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5">
                        <div className="eyebrow text-ember">{offer.eyebrow}</div>
                        <h2 className="mt-2 font-serif text-3xl lg:text-4xl text-coal">
                          {offer.name}
                        </h2>
                        <p className="mt-4 text-coal/75 leading-relaxed">{offer.summary}</p>

                        <div className="mt-6 flex items-baseline gap-3">
                          <div className="font-serif text-2xl lg:text-3xl text-coal">
                            {offer.priceFrom}
                          </div>
                          {offer.priceUnit && (
                            <div className="text-ash text-sm">{offer.priceUnit}</div>
                          )}
                        </div>

                        <div className="mt-6 eyebrow">Includes</div>
                        <ul className="mt-3 space-y-2 text-sm text-coal/80">
                          {offer.inclusions.map((inc) => (
                            <li key={inc} className="flex items-start gap-2.5">
                              <Check size={14} className="mt-1 text-ember shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 text-eyebrow uppercase tracking-widest text-ash">
                          {offer.validity}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                          <Link href="/contact" className="btn-primary">
                            {offer.cta} <ArrowRight size={16} />
                          </Link>
                        </div>

                        {offer.fineprint && (
                          <p className="mt-4 text-xs text-coal/55 leading-relaxed">
                            {offer.fineprint}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Direct booking benefits */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Why book direct"
              title="A better rate. Small touches."
              italicWord="touches."
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Best rate",
                  desc: "Direct booking always beats OTA pricing — and includes breakfast.",
                },
                {
                  title: "Flexibility",
                  desc: "Free cancellation up to 24 hours before check-in on most rates.",
                },
                {
                  title: "Room upgrade",
                  desc: "Complimentary upgrade when available — no fine print.",
                },
                {
                  title: "Late check-out",
                  desc: "Until 1 PM, often later on request. Confirmed at check-in.",
                },
              ].map((b, i) => (
                <Reveal key={b.title} delay={i * 0.05}>
                  <div className="border-t border-coal/15 pt-6">
                    <h3 className="font-serif text-xl text-coal">{b.title}</h3>
                    <p className="mt-2 text-sm text-coal/65 leading-relaxed">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          eyebrow="Book direct"
          title="Skip the comparison. Talk to us."
          subtitle="Call, message, or send a quick note — we usually reply within the hour with availability and a tailored quote."
          primary={{ label: "Contact the hotel", href: "/contact" }}
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