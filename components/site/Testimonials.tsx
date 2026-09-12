"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS, TESTIMONIAL_SOURCES } from "@/data/testimonials";
import { cn } from "@/lib/utils";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            "shrink-0",
            i <= rating ? "fill-ember text-ember" : "text-coal/15",
          )}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials({
  showFilter = false,
  title = "What our guests say.",
  italicWord = "say.",
  eyebrow = "Guest stories",
}: {
  showFilter?: boolean;
  title?: string;
  italicWord?: string;
  eyebrow?: string;
}) {
  const [filter, setFilter] = useState<(typeof TESTIMONIAL_SOURCES)[number]>("All");
  const filtered = TESTIMONIALS.filter((t) => filter === "All" || t.source === filter);

  return (
    <section className="bg-cream/50 py-20 lg:py-32">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="mt-3 text-display-md lg:text-display-lg text-coal">
            {title.replace(italicWord, "")}
            <span className="display-italic">{italicWord}</span>
          </h2>
        </motion.div>

        {showFilter && (
          <div className="mt-10 flex flex-wrap gap-2">
            {TESTIMONIAL_SOURCES.map((s) => {
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    active
                      ? "bg-coal text-ivory"
                      : "bg-ivory text-coal hover:bg-sand border border-coal/10",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.figure
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (i % 6) * 0.05,
                }}
                className="bg-ivory p-6 lg:p-8 border border-coal/5 flex flex-col h-full"
              >
                <Quote className="text-ember shrink-0" size={28} strokeWidth={1.25} />
                <blockquote className="mt-4 font-serif text-lg leading-relaxed text-coal/85 flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coal text-ivory flex items-center justify-center text-sm font-medium shrink-0">
                    {initials(t.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-coal truncate">{t.name}</div>
                    <div className="text-xs text-ash truncate">{t.role}</div>
                  </div>
                </div>
                <figcaption className="mt-4 pt-4 border-t border-coal/10 flex items-center justify-between text-xs">
                  <StarRow rating={t.rating} />
                  <span className="text-ash uppercase tracking-widest">{t.source}</span>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}