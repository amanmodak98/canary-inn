"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  italicWord,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  italicWord?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 className="mt-3 text-display-md lg:text-display-lg text-coal">
        {italicWord ? (
          <>
            {title}{" "}
            <span className="display-italic font-normal">{italicWord}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="mt-5 text-coal/70 text-lg leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}