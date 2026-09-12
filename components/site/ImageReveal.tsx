"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ImageReveal({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/5]",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspect} ${className}`}>
      <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}