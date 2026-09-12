"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/data/faq";

export default function FAQ({
  items = FAQS,
  title = "Common questions.",
  italicWord = "questions.",
  eyebrow = "Frequently asked",
  showJsonLd = true,
}: {
  items?: ReadonlyArray<{ q: string; a: string }>;
  title?: string;
  italicWord?: string;
  eyebrow?: string;
  showJsonLd?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28">
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

        <div className="mt-12 max-w-3xl">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.04,
                }}
                className="border-b border-coal/10"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                >
                  <span className="font-serif text-lg lg:text-xl text-coal group-hover:text-ember transition-colors">
                    {item.q}
                  </span>
                  <span className="shrink-0 mt-1 w-7 h-7 rounded-full border border-coal/20 flex items-center justify-center transition-all duration-300 group-hover:border-coal group-hover:bg-coal group-hover:text-ivory">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-coal/75 leading-relaxed max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
      {showJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}