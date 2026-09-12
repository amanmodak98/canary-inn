import Link from "next/link";
import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const SUGGESTED = [
  { label: "Rooms", href: "/rooms", desc: "Stay with us" },
  { label: "Dining", href: "/dining", desc: "Restaurant & bar" },
  { label: "Menu", href: "/menu", desc: "Browse the menu" },
  { label: "Offers", href: "/offers", desc: "Seasonal packages" },
  { label: "Events", href: "/events", desc: "Banquets & conferences" },
  { label: "Contact", href: "/contact", desc: "Reach the hotel" },
];

export default function NotFound() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative pt-32 lg:pt-40 pb-24 min-h-[80vh]">
        <div className="container-tight">
          <div className="max-w-3xl">
            <div className="eyebrow text-ember">404 · Not found</div>
            <h1 className="mt-3 font-serif text-display-lg lg:text-display-xl text-coal leading-[0.95]">
              We can't find <span className="display-italic">that page.</span>
            </h1>
            <p className="mt-6 max-w-xl text-coal/70 text-lg leading-relaxed">
              The link may be old or the page may have moved. Try one of these instead — or head back home.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SUGGESTED.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group border border-coal/15 p-6 hover:bg-ivory hover:border-coal/40 transition-colors"
              >
                <div className="text-eyebrow uppercase tracking-widest text-ash">{s.desc}</div>
                <div className="mt-2 font-serif text-2xl text-coal group-hover:text-ember transition-colors">
                  {s.label} →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">Back to home</Link>
            <Link href="/contact" className="btn-secondary">Contact the hotel</Link>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}