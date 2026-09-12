"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { HOTEL } from "@/lib/hotel";

const PRIMARY = [
  { label: "Rooms", href: "/rooms" },
  { label: "Dining", href: "/dining" },
  { label: "Events", href: "/events" },
  { label: "Stay", href: "/offers" }, // dropdown trigger — direct-link falls back to /offers
  { label: "Contact", href: "/contact" },
];

const STAY_LINKS = [
  { label: "Offers & packages", href: "/offers", desc: "Seasonal rates & escapes" },
  { label: "Experience", href: "/experience", desc: "Amenities & surroundings" },
  { label: "Gallery", href: "/gallery", desc: "A photo tour" },
  { label: "Guest reviews", href: "/reviews", desc: "Real stays, real reviews" },
  { label: "Menu", href: "/menu", desc: "Browse the full menu" },
];

// Tiny canary silhouette — echoes the ember/gold mark of the brand.
function CanaryMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 11c0-3 2.5-6 7-6 4 0 6 2.5 6 5.5 0 1.5-.5 2.5-1.5 3l1 4.5H11l-1-4h-1l-.5 4H6l1-5c-1-.5-2-1.2-2-2z" />
      <circle cx="14.5" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  // Stay dropdown is "active" if any of its sub-routes matches.
  if (href === "/offers") {
    return ["/offers", "/experience", "/gallery", "/reviews", "/menu"].some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );
  }
  return pathname.startsWith(href + "/");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stayOpen, setStayOpen] = useState(false);
  const stayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setStayOpen(false);
  }, [pathname]);

  // Close Stay dropdown on outside click / escape.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (stayRef.current && !stayRef.current.contains(e.target as Node)) {
        setStayOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStayOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scrollX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  const onDarkHero = pathname === "/" && !scrolled;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollX }}
        className="fixed top-0 inset-x-0 z-[60] h-[2px] origin-left bg-ember/90"
      />

      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-smooth",
          scrolled
            ? "bg-ivory/80 backdrop-blur-xl backdrop-saturate-150 border-b border-coal/5"
            : onDarkHero
              ? "bg-transparent"
              : "bg-ivory/0",
        ].join(" ")}
      >
        <div className="container-tight flex items-center justify-between h-16 lg:h-20 gap-6">
          {/* Logo — just mark + wordmark, no tagline in header (it lives in hero) */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Canary Inn — home"
          >
            <span
              className={[
                "shrink-0 transition-colors",
                onDarkHero
                  ? "text-ivory group-hover:text-ember"
                  : "text-coal group-hover:text-ember",
              ].join(" ")}
            >
              <CanaryMark className="w-7 h-7" />
            </span>
            <span
              className={[
                "font-serif text-xl lg:text-2xl tracking-tightest transition-colors",
                onDarkHero ? "text-ivory" : "text-coal",
              ].join(" ")}
            >
              Canary Inn
            </span>
          </Link>

          {/* Desktop nav — 5 items, tight spacing */}
          <nav className="hidden lg:flex items-center gap-1">
            {PRIMARY.map((n) => {
              const active = isActive(pathname, n.href);
              const isStay = n.label === "Stay";
              return (
                <div
                  key={n.label}
                  ref={isStay ? stayRef : undefined}
                  className="relative"
                  onMouseEnter={isStay ? () => setStayOpen(true) : undefined}
                  onMouseLeave={isStay ? () => setStayOpen(false) : undefined}
                >
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={isStay ? "menu" : undefined}
                    aria-expanded={isStay ? stayOpen : undefined}
                    className={[
                      "group relative inline-flex items-center gap-1 px-3 py-2 text-[13px] uppercase tracking-[0.18em] transition-colors duration-300",
                      active
                        ? "text-ember"
                        : onDarkHero
                          ? "text-ivory/85 hover:text-ivory"
                          : "text-coal/80 hover:text-coal",
                    ].join(" ")}
                  >
                    <span>{n.label}</span>
                    {isStay && (
                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className={[
                          "transition-transform duration-300",
                          stayOpen ? "rotate-180" : "",
                          onDarkHero ? "text-ivory/60" : "text-coal/50",
                        ].join(" ")}
                      />
                    )}
                    <span
                      aria-hidden
                      className={[
                        "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-px transition-all duration-500 ease-smooth",
                        active
                          ? "w-4 bg-ember"
                          : "w-0 bg-coal group-hover:w-4",
                        onDarkHero && !active ? "bg-ivory" : "",
                      ].join(" ")}
                    />
                  </Link>

                  {/* Stay mega-menu */}
                  {isStay && (
                    <AnimatePresence>
                      {stayOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full right-0 mt-2 w-72 bg-ivory border border-coal/10 shadow-2xl shadow-coal/10 p-2"
                        >
                          <ul role="menu" className="flex flex-col">
                            {STAY_LINKS.map((s) => (
                              <li key={s.href} role="none">
                                <Link
                                  href={s.href}
                                  role="menuitem"
                                  className="group flex items-baseline justify-between gap-3 px-3 py-2.5 hover:bg-cream rounded-md transition-colors"
                                >
                                  <span className="min-w-0">
                                    <span className="block font-serif text-base text-coal group-hover:text-ember transition-colors">
                                      {s.label}
                                    </span>
                                    <span className="block text-[11px] uppercase tracking-widest text-ash mt-0.5">
                                      {s.desc}
                                    </span>
                                  </span>
                                  <ArrowUpRight
                                    size={14}
                                    className="opacity-30 group-hover:opacity-100 group-hover:text-ember transition-all shrink-0"
                                  />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right-side CTA only — phone & social moved to footer */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/contact"
              className="btn-ember !py-2.5 !px-5 !text-xs whitespace-nowrap"
            >
              Book a Stay <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={[
              "lg:hidden relative z-[70] inline-flex items-center gap-2 px-2 py-1.5 -mr-2 rounded-full transition-colors",
              open ? "text-ivory" : onDarkHero ? "text-ivory" : "text-coal",
            ].join(" ")}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
            <span className="text-eyebrow uppercase tracking-widest">
              {open ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 z-[55] bg-coal text-ivory overflow-y-auto"
          >
            <div className="container-tight flex items-center justify-between h-16">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                <CanaryMark className="w-7 h-7 text-ember" />
                <span className="font-serif text-xl tracking-tightest text-ivory">
                  Canary Inn
                </span>
              </Link>
            </div>

            <motion.nav
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
              }}
              className="container-tight pt-8 pb-12 flex flex-col"
            >
              {PRIMARY.map((n) => (
                <motion.div
                  key={n.label}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, n.href) ? "page" : undefined}
                    className={[
                      "group flex items-baseline justify-between py-4 border-b border-ivory/10",
                      isActive(pathname, n.href) ? "text-ember" : "text-ivory",
                    ].join(" ")}
                  >
                    <span className="font-serif text-4xl leading-none">{n.label}</span>
                    <ArrowUpRight
                      size={20}
                      className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Stay sub-list, expanded inline on mobile (no hover). */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2"
              >
                <div className="border-b border-ivory/10 pb-4">
                  <div className="eyebrow text-ash mt-4 mb-3">Inside Stay</div>
                  <ul className="grid grid-cols-1 gap-y-1">
                    {STAY_LINKS.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between py-2 text-ivory/85 hover:text-ember transition-colors"
                        >
                          <span className="font-serif text-lg">{s.label}</span>
                          <ArrowUpRight size={14} className="opacity-50" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Footer block — phone + CTA */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 pt-8 border-t border-ivory/10 space-y-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-ember w-full justify-center !py-4 !text-sm"
                >
                  Book a Stay <ArrowUpRight size={16} />
                </Link>
                <div className="text-eyebrow uppercase tracking-widest text-ash">
                  {HOTEL.address.city} · {HOTEL.address.state}
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}