import Link from "next/link";
import { HOTEL } from "@/lib/hotel";

export default function Footer() {
  return (
    <footer className="bg-coal text-ivory">
      <div className="container-tight py-20 lg:py-28 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="font-serif text-3xl tracking-tightest">Canary Inn</div>
          <div className="mt-1 text-eyebrow uppercase tracking-widest text-ash">
            Hazaribagh · est. warmth
          </div>
          <p className="mt-6 max-w-md text-ivory/70 text-sm leading-relaxed">
            {HOTEL.description}
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="text-eyebrow uppercase tracking-widest text-ash">Stay</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/rooms" className="hover:text-ember">Rooms</Link></li>
            <li><Link href="/offers" className="hover:text-ember">Offers</Link></li>
            <li><Link href="/events" className="hover:text-ember">Events & banquets</Link></li>
            <li><Link href="/experience" className="hover:text-ember">Experience</Link></li>
            <li><Link href="/gallery" className="hover:text-ember">Gallery</Link></li>
            <li><Link href="/reviews" className="hover:text-ember">Guest reviews</Link></li>
            <li><Link href="/contact" className="hover:text-ember">Book a stay</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-eyebrow uppercase tracking-widest text-ash">Dine</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/dining" className="hover:text-ember">Restaurant</Link></li>
            <li><Link href="/menu" className="hover:text-ember">Menu</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-eyebrow uppercase tracking-widest text-ash">Visit</div>
          <ul className="mt-4 space-y-3 text-sm text-ivory/80">
            <li>{HOTEL.address.line1}</li>
            <li>{HOTEL.address.line2}</li>
            <li>{HOTEL.address.city}, {HOTEL.address.state} {HOTEL.address.pincode}</li>
            <li className="pt-2">
              <a href={`tel:${HOTEL.contact.phone.replace(/\s/g, "")}`} className="hover:text-ember">
                {HOTEL.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${HOTEL.contact.email}`} className="hover:text-ember">
                {HOTEL.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-tight py-6 flex flex-col md:flex-row justify-between gap-3 text-eyebrow uppercase tracking-widest text-ash">
          <div>© {new Date().getFullYear()} Canary Inn · Hazaribagh, Jharkhand</div>
          <div className="flex gap-6">
            <a href={HOTEL.social.facebook} target="_blank" rel="noreferrer" className="hover:text-ember">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}