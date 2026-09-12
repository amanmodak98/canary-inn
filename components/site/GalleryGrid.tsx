"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { GallerySeed } from "@/types";

export default function GalleryGrid({ items }: { items: GallerySeed[] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
      {items.map((g, i) => (
        <motion.figure
          key={`${g.caption}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.05 }}
          className="break-inside-avoid mb-6 group"
        >
          <div className="relative overflow-hidden bg-cream">
            <Image
              src={g.imageUrl}
              alt={g.caption}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full h-auto transition-transform duration-1000 ease-luxury group-hover:scale-105"
            />
          </div>
          <figcaption className="mt-3 text-eyebrow uppercase tracking-widest text-ash">
            {g.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}