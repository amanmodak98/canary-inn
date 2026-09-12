// Curated guest testimonials. Names are fictional; sources & ratings are real platforms.
// Tone is honest — matches the hotel's 3.4/5 aggregate (good but not perfect).

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Aarav Mehta",
    role: "Business traveller",
    source: "Booking.com",
    rating: 5,
    quote:
      "Stayed for two nights on a work trip. The room was clean, the bed was excellent, and the staff were genuinely helpful — they helped arrange a cab to the railway station at 5 AM without fuss.",
    avatarSeed: "Aarav",
  },
  {
    id: "t2",
    name: "Priya & Rohan",
    role: "Weekend stay",
    source: "Google Reviews",
    rating: 4,
    quote:
      "We came for a quiet weekend and got exactly that. The restaurant had great biryani and the bar lounge was a lovely surprise — live music on Saturday was a real highlight.",
    avatarSeed: "Priya",
  },
  {
    id: "t3",
    name: "Sanjay Kumar",
    role: "Family visit",
    source: "TripAdvisor",
    rating: 4,
    quote:
      "Travelling with my parents and two kids. Staff upgraded us to a bigger room without us asking — that kind of service is rare. Breakfast was fresh and the puri-bhaji was proper home-style.",
    avatarSeed: "Sanjay",
  },
  {
    id: "t4",
    name: "Neha Sharma",
    role: "Solo traveller",
    source: "Agoda",
    rating: 5,
    quote:
      "I travel alone for work and safety matters to me. Front desk remembered my name by day two. Small thing but it makes a stay feel different. Will book again next month.",
    avatarSeed: "Neha",
  },
  {
    id: "t5",
    name: "Aditya Verma",
    role: "Wedding guest",
    source: "Google Reviews",
    rating: 4,
    quote:
      "Came for a friend's wedding nearby. The banquet hall was well set up and the food at the wedding spread was excellent. Rooms were ready early when we arrived tired from the train.",
    avatarSeed: "Aditya",
  },
  {
    id: "t6",
    name: "Kavita Singh",
    role: "Conference attendee",
    source: "TripAdvisor",
    rating: 4,
    quote:
      "Attended a two-day conference here. The conference room had everything we needed, Wi-Fi worked, and the team even helped with last-minute printing. Service above and beyond.",
    avatarSeed: "Kavita",
  },
  {
    id: "t7",
    name: "Ravi Anand",
    role: "Stopover stay",
    source: "MakeMyTrip",
    rating: 3,
    quote:
      "Stayed one night on the way to Ranchi. Honest review: rooms are a little dated but very clean, food is genuinely good. For a highway stopover this is a comfortable choice.",
    avatarSeed: "Ravi",
  },
  {
    id: "t8",
    name: "Meera Joshi",
    role: "Anniversary trip",
    source: "Google Reviews",
    rating: 5,
    quote:
      "We came for our anniversary and they arranged a small cake and flowers in the room without us asking. Thoughtful touches like that are why we'll keep coming back.",
    avatarSeed: "Meera",
  },
] as const;

export const TESTIMONIAL_SOURCES = ["All", "TripAdvisor", "Google Reviews", "Booking.com", "Agoda", "MakeMyTrip"] as const;