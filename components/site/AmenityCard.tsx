"use client";

import {
  UtensilsCrossed,
  Wine,
  Presentation,
  Briefcase,
  Wifi,
  Stethoscope,
  Car,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Wine,
  Presentation,
  Briefcase,
  Wifi,
  Stethoscope,
  Car,
  Clock,
};

export default function AmenityCard({
  name,
  icon,
  description,
  index = 0,
}: {
  name: string;
  icon: string;
  description: string;
  index?: number;
}) {
  const Icon = ICONS[icon] ?? Wifi;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="border-t border-coal/15 pt-6 group"
    >
      <Icon size={28} strokeWidth={1.25} className="text-ember transition-transform duration-500 group-hover:-translate-y-1" />
      <h3 className="mt-5 font-serif text-xl text-coal">{name}</h3>
      <p className="mt-2 text-coal/65 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}