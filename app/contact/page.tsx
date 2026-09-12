import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import LocationMap from "@/components/site/LocationMap";
import ContactForm from "@/components/site/ContactForm";
import FAQ from "@/components/site/FAQ";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description: `Contact ${HOTEL.name} ${HOTEL.address.city}. Reserve a room, plan an event or ask the team a question.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        <section className="pt-32 lg:pt-40 pb-12">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Contact & booking"
              title="Talk to the"
              italicWord="hotel."
              subtitle="Reserve a room, plan an event, or ask the team anything — we usually reply within the hour."
            />
          </div>
        </section>

        <section className="pb-24">
          <div className="container-tight grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="border border-coal/10 bg-cream/40 p-6 lg:p-8">
                  <div className="eyebrow">Call or write</div>
                  <ul className="mt-5 space-y-3 text-sm">
                    <li>
                      <a href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`} className="text-coal hover:text-ember block font-serif text-xl">
                        {HOTEL.contact.phoneDisplay}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${HOTEL.contact.email}`} className="text-coal hover:text-ember">
                        {HOTEL.contact.email}
                      </a>
                    </li>
                  </ul>

                  <div className="mt-8 eyebrow">Address</div>
                  <div className="mt-3 text-sm text-coal/80 leading-relaxed">
                    {HOTEL.address.line1}<br />
                    {HOTEL.address.line2}<br />
                    {HOTEL.address.city}, {HOTEL.address.state} {HOTEL.address.pincode}
                  </div>

                  <div className="mt-8 eyebrow">Hours</div>
                  <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-ash uppercase tracking-widest text-eyebrow">Front desk</dt>
                    <dd className="text-coal">24 hours</dd>
                    <dt className="text-ash uppercase tracking-widest text-eyebrow">Restaurant</dt>
                    <dd className="text-coal">{HOTEL.timings.restaurant}</dd>
                    <dt className="text-ash uppercase tracking-widest text-eyebrow">Bar</dt>
                    <dd className="text-coal">{HOTEL.timings.bar}</dd>
                  </dl>

                  <div className="mt-8">
                    <div className="eyebrow">Follow</div>
                    <a href={HOTEL.social.facebook} target="_blank" rel="noreferrer" className="mt-3 inline-block text-coal hover:text-ember">
                      facebook.com/CanaryInnHazaribag
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="channels" className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Booking platforms"
              title="Reserve through your"
              italicWord="favourite channel."
            />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOTEL.bookingChannels.map((b) => (
                <a
                  key={b.label}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-coal/15 p-6 hover:bg-ivory transition-colors group"
                >
                  <div className="text-eyebrow uppercase tracking-widest text-ash">Channel</div>
                  <div className="mt-2 font-serif text-xl text-coal group-hover:text-ember">{b.label}</div>
                  <div className="mt-3 text-xs text-coal/60">Opens in a new tab</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <FAQ />

        <section className="section">
          <div className="container-tight">
            <SectionHeading eyebrow="Map" title="Find us in" italicWord="Hazaribagh." />
            <div className="mt-12">
              <LocationMap />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}