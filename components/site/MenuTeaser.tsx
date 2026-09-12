"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/data/images";

const SIGNATURE = [
  { name: "Butter Chicken", desc: "Tandoori chicken in creamy tomato gravy.", price: 340, veg: false, image: IMAGES.dining.indian },
  { name: "Chicken Biryani", desc: "Long-grain basmati layered with chicken.", price: 320, veg: false, image: IMAGES.dining.biryani },
  { name: "Paneer Butter Masala", desc: "Cubes of paneer in rich tomato gravy.", price: 280, veg: true, image: IMAGES.dining.thali },
  { name: "Dal Makhani", desc: "Black lentils slow-cooked overnight.", price: 240, veg: true, image: IMAGES.dining.indian },
  { name: "Veg Manchurian", desc: "Glossy Indo-Chinese dumplings.", price: 220, veg: true, image: IMAGES.dining.chinese },
  { name: "Gulab Jamun", desc: "Warm dumplings in rose syrup.", price: 100, veg: true, image: IMAGES.dining.dessert },
];

export default function MenuTeaser() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SIGNATURE.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
          className="group"
        >
          <div className="relative aspect-[5/4] overflow-hidden bg-cream">
            <Image
              src={s.image}
              alt={s.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-ivory/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] uppercase tracking-widest">
              {s.veg ? "Veg" : "Non-veg"}
            </div>
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-coal">{s.name}</h3>
              <p className="mt-1 text-sm text-coal/65">{s.desc}</p>
            </div>
            <div className="font-serif text-lg text-coal">₹{s.price}</div>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="lg:col-span-3 flex justify-center mt-6"
      >
        <Link href="/menu" className="btn-primary">
          See the full menu <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}