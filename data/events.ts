import { IMAGES } from "./images";

// Venues, packages, and event-hosting info for Canary Inn Hazaribagh.
// Imagery is curated hospitality stock from the existing IMAGES map.

export const VENUES = [
  {
    slug: "banquet-hall",
    name: "Banquet Hall",
    capacity: "Up to 200 guests",
    layout: "4000 sq ft · banquet seating",
    image: IMAGES.gallery.exteriorDay,
    description:
      "Our flagship indoor venue. Air-conditioned, pillar-free and finished in warm neutrals — equally suited to a Hazaribagh wedding reception, an annual corporate day or a family celebration.",
    suitableFor: ["Weddings", "Engagements", "Anniversaries", "Corporate offsites", "Award nights"],
    amenities: [
      "Air-conditioned",
      "Pillar-free layout",
      "Stage & dance floor",
      "Customisable seating",
      "Bridal / green room",
      "Generator backup",
      "On-site catering",
      "Dedicated event manager",
    ],
    priceFrom: "₹1,500 per plate (veg)",
  },
  {
    slug: "conference-room",
    name: "Conference Room",
    capacity: "Up to 60 guests",
    layout: "Theatre · classroom · U-shape",
    image: IMAGES.amenities.conference,
    description:
      "A focused working space for offsites, trainings and one-day conferences. Two configurations available; high-speed Wi-Fi and full AV support included.",
    suitableFor: ["Conferences", "Training sessions", "Seminars", "Product launches", "Workshops"],
    amenities: [
      "Air-conditioned",
      "HD projector & screen",
      "PA system",
      "High-speed Wi-Fi",
      "Whiteboard / flipchart",
      "Stationery kits",
      "Tea / coffee service",
      "Day delegate packages",
    ],
    priceFrom: "₹1,200 per delegate (full day)",
  },
  {
    slug: "boardroom",
    name: "Boardroom",
    capacity: "Up to 20 guests",
    layout: "Boardroom seating · 1 large table",
    image: IMAGES.amenities.reception,
    description:
      "An intimate, private space for board meetings, depositions and small strategy sessions. Quiet, secure and supported by our business centre.",
    suitableFor: ["Board meetings", "Strategy sessions", "Investor meetings", "Deputations"],
    amenities: [
      "Air-conditioned",
      "Conference phone",
      "65\" display",
      "High-speed Wi-Fi",
      "Whiteboard",
      "Secretarial support",
      "Tea / coffee service",
      "Privacy & discretion",
    ],
    priceFrom: "₹8,000 for 4 hours",
  },
] as const;

export const EVENT_TYPES = [
  {
    title: "Weddings",
    desc: "From mehendi to reception — full-service wedding hosting with custom menus, decor coordination and a dedicated planner.",
    icon: "Sparkles",
  },
  {
    title: "Corporate Offsites",
    desc: "Day-long or multi-day offsites combining the conference room, accommodation and team dinners.",
    icon: "Briefcase",
  },
  {
    title: "Conferences",
    desc: "Single-day to three-day conferences with delegate packages, AV support and break-out rooms.",
    icon: "Presentation",
  },
  {
    title: "Social Gatherings",
    desc: "Birthdays, anniversaries, baby showers and family reunions — we handle the setup and the food.",
    icon: "Users",
  },
] as const;

export const EVENT_TIMELINE = [
  { step: "01", title: "Enquire", desc: "Send us your date, head-count and the kind of event. We reply within the hour." },
  { step: "02", title: "Site visit", desc: "Visit the property, walk through the venue, taste the proposed menu." },
  { step: "03", title: "Confirm", desc: "Lock the date with a 30% advance. We'll assign a dedicated event manager." },
  { step: "04", title: "Plan", desc: "Final menu, seating chart, decor and run-of-show — typically two weeks out." },
  { step: "05", title: "Execute", desc: "On the day, our team handles setup, service and teardown. You host." },
] as const;

export const CATERING_NOTES = [
  "Multi-cuisine menus: Indian, Chinese, continental and live counters",
  "Veg, Jain, vegan and allergen-specific preparations on request",
  "Live stations: chaat, pasta, tandoor, desserts",
  "Bar packages — house, premium or by-the-bottle",
  "Customisable per-plate pricing for groups of 50+",
] as const;