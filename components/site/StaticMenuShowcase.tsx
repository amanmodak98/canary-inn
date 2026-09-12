"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, ChefHat } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/data/menu";
import { IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";

function VegBadge({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-3.5 h-3.5 border-2 flex items-center justify-center shrink-0",
        veg ? "border-leaf" : "border-ember",
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", veg ? "bg-leaf" : "bg-ember")} />
    </span>
  );
}

export default function StaticMenuShowcase({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory && MENU_CATEGORIES.some((c) => c.slug === initialCategory)
      ? initialCategory
      : MENU_CATEGORIES[0].slug,
  );
  const [search, setSearch] = useState("");

  const category = useMemo(
    () => MENU_CATEGORIES.find((c) => c.slug === activeCategory) ?? MENU_CATEGORIES[0],
    [activeCategory],
  );

  const items = useMemo(() => {
    const all = MENU_ITEMS.filter((i) => i.category === activeCategory);
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (i) =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    );
  }, [activeCategory, search]);

  const totalCount = MENU_ITEMS.length;

  return (
    <section className="bg-ivory py-12 lg:py-20">
      <div className="container-tight">
        {/* Editorial intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-12 gap-10 items-end mb-12"
        >
          <div className="lg:col-span-7">
            <div className="eyebrow">The menu</div>
            <h1 className="mt-3 text-display-md lg:text-display-lg text-coal">
              From the kitchen to <span className="display-italic">your table.</span>
            </h1>
            <p className="mt-5 max-w-xl text-coal/75 text-lg leading-relaxed">
              A multi-cuisine kitchen serving Indian, Chinese and continental favourites — breakfast through dinner. {totalCount} dishes, freshly made.
            </p>
          </div>
          <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden bg-cream">
            <Image
              src={IMAGES.dining.chef}
              alt="Canary Inn kitchen"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ash" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes…"
            className="w-full pl-11 pr-4 py-3 bg-cream rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
          />
        </div>

        {/* Category chips */}
        <div className="mt-6 -mx-5 lg:mx-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-5 lg:px-0 min-w-max">
            {MENU_CATEGORIES.map((c) => {
              const active = c.slug === activeCategory;
              const count = MENU_ITEMS.filter((i) => i.category === c.slug).length;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    active
                      ? "bg-coal text-ivory"
                      : "bg-cream text-coal hover:bg-sand",
                  )}
                >
                  {c.name}
                  <span
                    className={cn(
                      "ml-2 text-[11px] tracking-widest uppercase",
                      active ? "text-ivory/60" : "text-ash",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <motion.div
          key={category.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <div className="flex items-baseline justify-between border-b border-coal/15 pb-4">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-coal">{category.name}</h2>
              {category.description && (
                <p className="mt-1 text-coal/60">{category.description}</p>
              )}
            </div>
            <div className="text-eyebrow uppercase tracking-widest text-ash">
              {items.length} {items.length === 1 ? "dish" : "dishes"}
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-6">
            {items.map((it, i) => (
              <motion.div
                key={`${category.slug}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(i, 8) * 0.03,
                }}
                className="flex gap-4 pb-6 border-b border-coal/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <VegBadge veg={it.isVeg} />
                    <h3 className="font-serif text-lg text-coal">{it.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-coal/65 leading-relaxed">
                    {it.description}
                  </p>
                </div>
                <div className="font-serif text-lg text-coal shrink-0">₹{it.price}</div>
              </motion.div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="py-16 text-center text-coal/60">
              No dishes match "{search}". Try another search.
            </div>
          )}
        </motion.div>

        {/* QR ordering note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 lg:mt-24 bg-coal text-ivory rounded-3xl p-8 lg:p-12 grid lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 text-ember">
              <ChefHat size={22} strokeWidth={1.5} />
              <div className="eyebrow text-ember">At the table</div>
            </div>
            <h3 className="mt-3 font-serif text-2xl lg:text-3xl text-ivory">
              Scan. Choose. Eat.
            </h3>
            <p className="mt-3 text-ivory/75 max-w-xl leading-relaxed">
              Visiting us for a meal? Every restaurant table has its own QR. Scan it, choose your dishes, and the kitchen sees your order in seconds.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/contact"
              className="btn-ember !bg-ivory !text-coal hover:!bg-ember hover:!text-ivory"
            >
              Reserve a table <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}