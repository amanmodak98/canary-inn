import { IMAGES } from "./images";

// Seasonal offers and stay packages. Prices are starting "from" and exclude taxes.

export const OFFERS = [
  {
    slug: "weekend-stay-dinner",
    name: "Weekend Stay + Dinner",
    eyebrow: "Limited time",
    badge: "Most booked",
    validity: "Fri · Sat · Sun check-ins",
    image: IMAGES.rooms.deluxe,
    summary:
      "A two-night weekend escape in a Deluxe room with breakfast and a three-course dinner for two.",
    inclusions: [
      "Two nights in a Deluxe room",
      "Daily breakfast for two",
      "Three-course dinner for two (one evening)",
      "Late check-out until 1 PM",
      "Complimentary welcome drink",
    ],
    priceFrom: "₹5,999",
    priceUnit: "/ night",
    cta: "Book this offer",
    fineprint: "Subject to availability. Blackout dates: 22–26 Dec, 14–16 Feb.",
  },
  {
    slug: "extended-stay",
    name: "Extended Stay",
    eyebrow: "Stay 4, save 25%",
    badge: "Best for longer trips",
    validity: "Year-round · 4+ nights",
    image: IMAGES.rooms.superDeluxe,
    summary:
      "Staying four nights or more? Enjoy 25% off our best available rate, daily breakfast and a complimentary room upgrade when available.",
    inclusions: [
      "25% off best available rate",
      "Daily breakfast for two",
      "Complimentary room upgrade (subject to availability)",
      "Free early check-in from 9 AM",
      "Laundry credit of ₹500 per stay",
    ],
    priceFrom: "From ₹2,499",
    priceUnit: "/ night",
    cta: "Plan an extended stay",
    fineprint: "Discount applies to room only. Cannot be combined with other offers.",
  },
  {
    slug: "canary-romantic-escape",
    name: "Canary Romantic Escape",
    eyebrow: "Couples",
    badge: "Signature",
    validity: "Year-round",
    image: IMAGES.rooms.suite,
    summary:
      "Our signature suite experience for two — private dinner, in-room breakfast and thoughtful touches that make it feel like a small celebration.",
    inclusions: [
      "Two nights in the Canary Suite",
      "Private three-course dinner (one evening)",
      "In-room breakfast on both mornings",
      "Decorated room with flowers & cake",
      "Couple's spa-style bath ritual",
      "Late check-out until 2 PM",
    ],
    priceFrom: "₹12,999",
    priceUnit: "/ 2 nights",
    cta: "Plan a romantic escape",
    fineprint: "Minimum 2 nights. 48-hour cancellation policy.",
  },
  {
    slug: "business-traveller",
    name: "Business Traveller",
    eyebrow: "Working away from home",
    badge: "Mon–Thu",
    validity: "Monday to Thursday check-ins",
    image: IMAGES.rooms.standard,
    summary:
      "Designed for the working traveller — quiet room, fast Wi-Fi, breakfast on the go and a guaranteed late check-out.",
    inclusions: [
      "Standard or Deluxe room",
      "Express breakfast or grab-and-go option",
      "60-min boardroom access per stay",
      "High-speed Wi-Fi (priority bandwidth)",
      "Laundry credit of ₹300 per night",
      "Late check-out until 3 PM",
      "Complimentary airport / station transfers (Ranchi airport on request)",
    ],
    priceFrom: "From ₹2,199",
    priceUnit: "/ night",
    cta: "Book for business",
    fineprint: "Available Sun–Thu check-ins only. Airport transfers subject to vehicle availability.",
  },
] as const;