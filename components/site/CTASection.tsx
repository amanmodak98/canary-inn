"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HOTEL } from "@/lib/hotel";

export default function CTASection({
  eyebrow = "Stay with us",
  title = "A bed, a kitchen and a Hazaribagh evening.",
  subtitle = "Reserve directly with us, or pick a room on your favourite booking platform.",
  primary = { label: "Check Availability", href: "/contact" },
  secondary,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="bg-coal text-ivory py-24 lg:py-32">
      <div className="container-tight grid lg:grid-cols-12 gap-10 items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="eyebrow text-ember">{eyebrow}</div>
          <h2 className="mt-3 text-display-md lg:text-display-lg text-ivory">{title}</h2>
          <p className="mt-5 text-ivory/70 text-lg max-w-xl">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="lg:col-span-5 lg:justify-self-end flex flex-wrap gap-3"
        >
          <Link href={primary.href} className="btn-ember">
            {primary.label} <ArrowRight size={16} />
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-secondary !text-ivory !border-ivory/40 hover:!bg-ivory hover:!text-coal">
              {secondary.label}
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="lg:col-span-12 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-ivory/15 pt-10 text-eyebrow uppercase tracking-widest text-ash"
        >
          <div>
            <div className="text-ivory/80">{HOTEL.timings.checkIn}</div>
            <div className="text-ash mt-1">Check-in</div>
          </div>
          <div>
            <div className="text-ivory/80">{HOTEL.timings.checkOut}</div>
            <div className="text-ash mt-1">Check-out</div>
          </div>
          <div>
            <div className="text-ivory/80">{HOTEL.timings.restaurant}</div>
            <div className="text-ash mt-1">Restaurant</div>
          </div>
          <div>
            <div className="text-ivory/80">{HOTEL.timings.bar}</div>
            <div className="text-ash mt-1">Bar & lounge</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}