"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { HOTEL } from "@/lib/hotel";
import { IMAGES } from "@/data/images";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={IMAGES.hero.primary}
          alt="Canary Inn Hazaribagh — hotel lobby"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coal/30 via-coal/40 to-coal/70" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative h-full container-tight flex flex-col justify-end pb-16 lg:pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-ivory"
        >
          <div className="flex items-center gap-3 text-eyebrow uppercase tracking-widest text-ivory/80">
            <span className="h-px w-8 bg-ivory/40" />
            <span>Hazaribagh · Jharkhand</span>
          </div>
          <h1 className="mt-5 font-serif text-display-lg lg:text-display-xl text-ivory leading-[0.95] max-w-4xl">
            A warm stay on the{" "}
            <em className="display-italic not-italic text-ember">Ranchi–Patna</em> highway.
          </h1>
          <p className="mt-6 max-w-xl text-ivory/80 text-lg leading-relaxed">
            A 3-star hotel, multi-cuisine restaurant and bar on NH-33 — quiet rooms, generous food and a Hazaribagh favourite for live evenings.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/rooms" className="btn-ember">
              Explore Rooms <ArrowRight size={16} />
            </Link>
            <Link href="/menu" className="btn-secondary !text-ivory !border-ivory/40 hover:!bg-ivory hover:!text-coal">
              View Menu
            </Link>
            <Link href="/contact" className="btn-primary !bg-ivory !text-coal hover:!bg-ember hover:!text-ivory">
              Book Your Stay
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="hidden md:flex absolute bottom-10 right-10 lg:bottom-16 lg:right-16 gap-8 text-ivory/80 text-eyebrow uppercase tracking-widest"
        >
          <a href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-ember">
            <Phone size={14} /> {HOTEL.contact.phoneDisplay}
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={14} /> {HOTEL.address.line2}, {HOTEL.address.city}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/60 text-eyebrow uppercase tracking-widest"
      >
        Scroll
      </motion.div>
    </section>
  );
}