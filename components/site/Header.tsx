"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Dining", href: "/dining" },
  { label: "Menu", href: "/menu" },
  { label: "Events", href: "/events" },
  { label: "Offers", href: "/offers" },
  { label: "Experience", href: "/experience" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-smooth ${
        scrolled ? "bg-ivory/85 backdrop-blur border-b border-coal/5" : "bg-transparent"
      }`}
    >
      <div className="container-tight flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl lg:text-2xl text-coal tracking-tightest">
            Canary Inn
          </span>
          <span className="hidden lg:inline text-eyebrow uppercase tracking-widest text-ash group-hover:text-ember transition-colors">
            · Hazaribagh
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm uppercase tracking-widest text-coal/80 hover:text-ember transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-ember !py-2 !px-5 !text-xs">
            Book a Stay
          </Link>
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-ivory border-t border-coal/5"
          >
            <div className="container-tight py-6 flex flex-col gap-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-serif text-coal"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-ember mt-2 w-fit"
              >
                Book a Stay
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}