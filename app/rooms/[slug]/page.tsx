import { notFound } from "next/navigation";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ImageReveal from "@/components/site/ImageReveal";
import Reveal from "@/components/site/Reveal";
import RoomCard from "@/components/site/RoomCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROOMS } from "@/data/rooms";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const room = ROOMS.find((r) => r.slug === params.slug);
  if (!room) return { title: "Room not found" };
  return {
    title: room.name,
    description: room.description,
    alternates: { canonical: `/rooms/${room.slug}` },
  };
}

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export default function RoomDetail({ params }: { params: { slug: string } }) {
  const room = ROOMS.find((r) => r.slug === params.slug);
  if (!room) return notFound();

  const related = ROOMS.filter((r) => r.slug !== room.slug);

  return (
    <SmoothScroll>
      <Header />
      <main className="relative">
        {/* Hero gallery */}
        <section className="pt-24 lg:pt-28">
          <div className="container-tight">
            <Reveal>
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 text-eyebrow uppercase tracking-widest text-ash hover:text-ember"
              >
                <ArrowLeft size={14} /> All rooms
              </Link>
            </Reveal>
            <div className="mt-8 grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-8">
                <ImageReveal src={room.heroImage} alt={room.name} aspect="aspect-[16/10]" priority />
              </div>
              <div className="hidden lg:flex col-span-4 flex-col gap-4">
                {room.images.slice(1, 3).map((img, i) => (
                  <ImageReveal key={i} src={img} alt={`${room.name} ${i + 2}`} aspect="aspect-[16/10]" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Title + body */}
        <section className="section">
          <div className="container-tight grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="eyebrow">Room</div>
                <h1 className="mt-3 text-display-md lg:text-display-lg text-coal">{room.name}</h1>
                <p className="mt-6 text-coal/75 text-lg leading-relaxed">{room.description}</p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-12">
                  <div className="eyebrow">In-room amenities</div>
                  <ul className="mt-5 grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-coal/85">
                    {room.amenities.map((a) => (
                      <li key={a} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 rounded-full bg-ember shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={0.1}>
                <div className="border border-coal/10 bg-ivory p-6 lg:p-8">
                  <div className="eyebrow">At a glance</div>
                  <dl className="mt-5 grid grid-cols-2 gap-y-5 text-sm">
                    {room.bedType && (
                      <>
                        <dt className="text-ash uppercase tracking-widest text-eyebrow">Bed</dt>
                        <dd className="text-coal">{room.bedType}</dd>
                      </>
                    )}
                    {room.maxGuests && (
                      <>
                        <dt className="text-ash uppercase tracking-widest text-eyebrow">Guests</dt>
                        <dd className="text-coal">Up to {room.maxGuests}</dd>
                      </>
                    )}
                    <dt className="text-ash uppercase tracking-widest text-eyebrow">Price</dt>
                    <dd className="text-coal">Check channel pricing</dd>
                  </dl>

                  <div className="mt-8 flex flex-col gap-2">
                    <Link href="/contact" className="btn-primary justify-center">
                      {room.bookingCta}
                    </Link>
                    <a
                      href={`mailto:reservations@canaryinn.com?subject=${encodeURIComponent(
                        `Enquiry — ${room.name}`,
                      )}`}
                      className="btn-secondary justify-center"
                    >
                      Email the hotel
                    </a>
                  </div>

                  {room.externalBooking?.length > 0 && (
                    <div className="mt-8">
                      <div className="eyebrow">Also on</div>
                      <ul className="mt-3 space-y-2 text-sm">
                        {room.externalBooking.map((b) => (
                          <li key={b.label}>
                            <a
                              href={b.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-coal hover:text-ember"
                            >
                              · {b.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Reveal>
            </aside>
          </div>
        </section>

        <section className="section bg-cream/50">
          <div className="container-tight">
            <Reveal>
              <div className="eyebrow">More rooms</div>
              <h2 className="mt-3 text-display-md text-coal">If you like this, you might also like</h2>
            </Reveal>
            <div className="mt-12 grid md:grid-cols-3 gap-10">
              {related.map((r, i) => (
                <RoomCard key={r.slug} room={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}