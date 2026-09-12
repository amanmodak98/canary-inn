import Hero from "@/components/site/Hero";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import ImageReveal from "@/components/site/ImageReveal";
import RoomCard from "@/components/site/RoomCard";
import AmenityCard from "@/components/site/AmenityCard";
import MenuTeaser from "@/components/site/MenuTeaser";
import GalleryGrid from "@/components/site/GalleryGrid";
import CTASection from "@/components/site/CTASection";
import LocationMap from "@/components/site/LocationMap";
import Testimonials from "@/components/site/Testimonials";
import { ROOMS } from "@/data/rooms";
import { AMENITIES } from "@/data/amenities";
import { GALLERY } from "@/data/gallery";
import { HOTEL } from "@/lib/hotel";
import { IMAGES } from "@/data/images";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        <Hero />

        {/* About */}
        <section className="section">
          <div className="container-tight grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="eyebrow">About the hotel</div>
                <h2 className="mt-3 text-display-md lg:text-display-lg text-coal">
                  A 3-star address in <span className="display-italic">Alfalah Colony</span>.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:pt-6">
              <Reveal delay={0.1}>
                <p className="text-lg text-coal/75 leading-relaxed">{HOTEL.description}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { v: "12", l: "Tables" },
                    { v: "4", l: "Room types" },
                    { v: "7 am", l: "Breakfast from" },
                    { v: "Live", l: "Music Fridays" },
                  ].map((f) => (
                    <div key={f.l}>
                      <div className="font-serif text-3xl text-coal">{f.v}</div>
                      <div className="mt-1 eyebrow">{f.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Rooms"
              title="A bed for every"
              italicWord="occasion."
              subtitle="From the practical Standard to our signature Canary Suite, every room is finished for warmth, light and a good night's sleep."
            />
            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ROOMS.map((r, i) => (
                <RoomCard key={r.slug} room={r} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Dining */}
        <section className="section">
          <div className="container-tight grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Reveal>
                <div className="eyebrow">Dining</div>
                <h2 className="mt-3 text-display-md lg:text-display-lg text-coal">
                  A multi-cuisine kitchen and a Hazaribagh favourite for <span className="display-italic">live evenings</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-coal/75 text-lg leading-relaxed">
                  The in-house restaurant serves Indian, Chinese and continental favourites — from breakfast puri-bhaji to a slow-cooked Hyderabadi biryani. Our bar and lounge hosts live performances and is one of the city's most-loved casual evening spots.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/dining" className="btn-primary">The Restaurant</a>
                  <a href="/menu" className="btn-secondary">Order via QR</a>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 grid grid-cols-12 gap-4">
              <ImageReveal src={IMAGES.dining.restaurant} alt="Canary Inn restaurant" className="col-span-7 col-start-1" aspect="aspect-[4/5]" />
              <ImageReveal src={IMAGES.dining.barLounge} alt="Bar lounge" className="col-span-5 col-start-8 mt-12" aspect="aspect-[3/4]" />
            </div>
          </div>
        </section>

        {/* Signature Menu */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="From the kitchen"
              title="Signature"
              italicWord="plates."
              subtitle="A handful of the dishes we make best — the rest of the menu is on the QR."
            />
            <div className="mt-14">
              <MenuTeaser />
            </div>
          </div>
        </section>

        {/* Hotel Amenities */}
        <section className="section">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Hotel amenities"
              title="Considered, never"
              italicWord="overstated."
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {AMENITIES.map((a, i) => (
                <AmenityCard key={a.name} {...a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Gallery */}
        <section className="section bg-cream/50">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Gallery"
              title="Quiet corners,"
              italicWord="generous plates."
              subtitle="A few moments from the property."
            />
            <div className="mt-14">
              <GalleryGrid items={GALLERY.slice(0, 9)} />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="section">
          <div className="container-tight">
            <SectionHeading
              eyebrow="Find us"
              title="On the highway, in the hills of"
              italicWord="Hazaribagh."
            />
            <div className="mt-14">
              <LocationMap />
            </div>
          </div>
        </section>

        <CTASection
          title="A bed, a kitchen and a Hazaribagh evening."
          subtitle="Reserve with us, or browse availability on your favourite booking platform."
          primary={{ label: "Check Availability", href: "/contact" }}
          secondary={{ label: "Explore Rooms", href: "/rooms" }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}