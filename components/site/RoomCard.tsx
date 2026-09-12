"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { RoomSeed } from "@/types";

export default function RoomCard({ room, index = 0 }: { room: RoomSeed; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group relative"
    >
      <Link href={`/rooms/${room.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            src={room.heroImage}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal/30 to-transparent" />
          {room.bedType && (
            <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur px-3 py-1 rounded-full text-eyebrow uppercase tracking-widest">
              {room.bedType} bed
            </div>
          )}
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl lg:text-3xl text-coal">{room.name}</h3>
            <p className="mt-2 text-coal/70 text-sm leading-relaxed max-w-md">
              {room.description}
            </p>
          </div>
          <div className="shrink-0 w-10 h-10 rounded-full border border-coal/20 flex items-center justify-center transition-all duration-500 group-hover:bg-coal group-hover:text-ivory group-hover:border-coal">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}