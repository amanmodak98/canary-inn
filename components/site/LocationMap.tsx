"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HOTEL } from "@/lib/hotel";
import { IMAGES } from "@/data/images";

export default function LocationMap() {
  const { lat, lng } = HOTEL.location;
  // Embed without API key — OpenStreetMap staticmap works without keys.
  const delta = 0.01;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-cream"
      >
        <iframe
          src={mapSrc}
          title="Canary Inn Hazaribagh — map"
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-3 bg-ivory/90 backdrop-blur px-3 py-1.5 rounded-full text-eyebrow uppercase tracking-widest hover:bg-ivory"
        >
          View larger map
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="lg:col-span-5 space-y-8"
      >
        <div>
          <div className="eyebrow">Visit us</div>
          <h3 className="mt-3 font-serif text-2xl text-coal">{HOTEL.name}</h3>
          <div className="mt-2 text-coal/75 text-sm leading-relaxed">
            {HOTEL.address.line1}<br />
            {HOTEL.address.line2}<br />
            {HOTEL.address.city}, {HOTEL.address.state} {HOTEL.address.pincode}<br />
            {HOTEL.address.country}
          </div>
        </div>
        <div>
          <div className="eyebrow">Reach us</div>
          <div className="mt-3 space-y-1 text-sm">
            <a href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`} className="block text-coal hover:text-ember">{HOTEL.contact.phoneDisplay}</a>
            <a href={`mailto:${HOTEL.contact.email}`} className="block text-coal hover:text-ember">{HOTEL.contact.email}</a>
          </div>
        </div>
        <div>
          <div className="eyebrow">Nearby</div>
          <ul className="mt-3 space-y-1 text-sm text-coal/80">
            {HOTEL.nearby.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[16/8] overflow-hidden bg-cream">
          <Image src={IMAGES.location.canaryHill} alt="Canary Hill, Hazaribagh" fill sizes="33vw" className="object-cover" />
        </div>
      </motion.div>
    </div>
  );
}