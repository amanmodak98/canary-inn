// Verified Canary Inn Hazaribagh facts — sourced from web research.
// Do not invent values. Where info is unverified, leave nullable.

export const HOTEL = {
  name: "Canary Inn",
  tagline: "A warm stay on the Ranchi–Patna highway",
  description:
    "Canary Inn is a 3-star hotel, restaurant and bar on NH-33 in Alfalah Colony, Hazaribagh — offering spacious accommodation, a multi-cuisine kitchen and a lively bar lounge, all a short drive from Hazaribagh Town Railway Station.",
  address: {
    line1: "NH-33, Ranchi–Patna Road",
    line2: "Alfalah Colony",
    city: "Hazaribagh",
    state: "Jharkhand",
    pincode: "825301",
    country: "India",
  },
  contact: {
    phone: "+91 6546 272 769",
    phoneDisplay: "+91 6546 272 769",
    email: "canaryinn@gmail.com",
  },
  social: {
    facebook: "https://www.facebook.com/CanaryInnHazaribag",
    instagram: null,
  },
  timings: {
    checkIn: "12:00 PM",
    checkOut: "12:00 PM",
    restaurant: "7:00 AM – 11:00 PM",
    bar: "11:00 AM – 11:00 PM",
  },
  ratings: {
    aggregate: "3.4 / 5",
    tripAdvisor: "3.4",
    agoda: "8.0",
    notes: "Based on public reviews on TripAdvisor and Agoda (Sept 2026).",
  },
  nearby: [
    "Hazaribagh Town Railway Station — ~1.7 km",
    "Hazaribagh Lake / Canary Hill — ~3 km",
    "Hazaribagh National Park — ~16 km",
    "Konar Dam — ~28 km",
  ],
  bookingChannels: [
    { label: "MakeMyTrip", url: "https://www.makemytrip.com/hotels/canary_inn_hotel-details-hazaribagh.html" },
    { label: "Goibibo", url: "https://www.goibibo.com/hotels/canary-inn-hotel-in-hazaribagh-2224377105421041870/" },
    { label: "Agoda", url: "https://www.agoda.com/hotel-canary-inn/hotel/hazaribagh-in.html" },
    { label: "OYO", url: "https://www.oyorooms.com/hotels/canary_inn-hazaribagh/" },
  ],
  location: {
    lat: 23.9936,
    lng: 85.3636,
  },
} as const;

export type HotelInfo = typeof HOTEL;