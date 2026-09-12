import SmoothScroll from "@/components/site/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Testimonials from "@/components/site/Testimonials";
import CTASection from "@/components/site/CTASection";
import { HOTEL } from "@/lib/hotel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description: `Reviews of ${HOTEL.name} ${HOTEL.address.city} from Booking.com, TripAdvisor, Google, Agoda and MakeMyTrip.`,
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="relative pt-24 lg:pt-32">
        <Testimonials
          showFilter
          eyebrow="What our guests say"
          title="Real stays. Real"
          italicWord="reviews."
        />
        <CTASection
          eyebrow="Stay with us"
          title="Come see for yourself."
          subtitle="A bed, a kitchen and a Hazaribagh evening — reserve directly with us for the best available rate."
          primary={{ label: "Contact the hotel", href: "/contact" }}
          secondary={{ label: "Explore rooms", href: "/rooms" }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}