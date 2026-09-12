// Curated hospitality imagery for Canary Inn Hazaribagh.
//
// This file is intentionally pure data (no filesystem access) so it can be
// imported from server components, client components, edge routes and
// metadata endpoints without bundling issues.
//
// To swap a slot for a real hotel photo:
//   1. Drop the photo into /public/hotel/ with the matching filename stem
//      (see /public/hotel/DROPPOINT.md and SLOT_TO_FILE below).
//   2. Run `npm run images:wire` (or just `npm run build` — the prebuild
//      script does it automatically).
//
// `scripts/wire-local-images.js` rewrites the URLs in this file in place,
// replacing each Unsplash fallback with `/hotel/<basename>.<ext>` whenever a
// matching file exists in /public/hotel/.

const u = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Local-file basename for each slot. Mirrors the keys in IMAGES below.
// Keep in sync with /public/hotel/DROPPOINT.md.
export const SLOT_TO_FILE: Record<string, string> = {
  "hero.primary": "hero-primary",
  "hero.secondary": "hero-secondary",
  "rooms.standard": "room-standard",
  "rooms.deluxe": "room-deluxe",
  "rooms.superDeluxe": "room-superdeluxe",
  "rooms.suite": "room-suite",
  "rooms.bed": "room-bed",
  "rooms.bath": "room-bath",
  "rooms.interior": "room-interior",
  "rooms.window": "room-window",
  "rooms.work": "room-bed",
  "rooms.lounge": "room-lounge",
  "dining.restaurant": "dining-restaurant",
  "dining.table": "dining-restaurant",
  "dining.plate": "dining-plate",
  "dining.cocktail": "dining-cocktail",
  "dining.chef": "dining-chef",
  "dining.ambience": "dining-restaurant",
  "dining.breakfast": "dining-breakfast",
  "dining.dessert": "dining-dessert",
  "dining.biryani": "dining-biryani",
  "dining.thali": "dining-thali",
  "dining.indian": "dining-indian",
  "dining.chinese": "dining-chinese",
  "dining.soups": "dining-soups",
  "dining.bread": "dining-bread",
  "dining.coffee": "dining-coffee",
  "dining.drinks": "dining-drinks",
  "dining.barLounge": "dining-bar-lounge",
  "dining.liveMusic": "dining-live-music",
  "amenities.pool": "amenity-pool",
  "amenities.spa": "gallery-spa",
  "amenities.gym": "gallery-spa",
  "amenities.parking": "exterior-day",
  "amenities.wifi": "lobby",
  "amenities.conference": "amenity-conference",
  "amenities.garden": "exterior-day",
  "amenities.reception": "amenity-reception",
  "gallery.exteriorDay": "exterior-day",
  "gallery.exteriorNight": "exterior-night",
  "gallery.lobby": "lobby",
  "gallery.pool": "amenity-pool",
  "gallery.restaurant": "dining-restaurant",
  "gallery.bar": "dining-bar",
  "gallery.suite": "room-suite",
  "gallery.room": "room-standard",
  "gallery.breakfast": "dining-breakfast",
  "gallery.plate": "dining-plate",
  "gallery.cocktail": "dining-cocktail",
  "gallery.citySky": "location-hazaribagh",
  "gallery.details": "lobby",
  "gallery.service": "lobby",
  "gallery.food": "dining-plate",
  "gallery.spa": "gallery-spa",
  "location.hazaribagh": "location-hazaribagh",
  "location.canaryHill": "location-canary-hill",
};

export const IMAGES = {
  hero: {
    primary: u("1564013799919-ab600027ffc6", 2400),
    secondary: u("1551882547-ff40c63fe5fa", 2400),
    rooftop: u("1582719508461-905c673771fd", 2400),
  },
  rooms: {
    standard: u("1631049307264-da0ec9d70304", 1600),
    deluxe: u("1611892440504-42a792e24d32", 1600),
    superDeluxe: u("1590490360182-c33d57733427", 1600),
    suite: u("1582719478250-c89cae4dc85b", 1600),
    bed: u("1505693416388-ac5ce068fe85", 1600),
    bath: u("1552321554-5fefe8c9ef14", 1600),
    interior: u("1631049552057-403cdb8f0658", 1600),
    window: u("1566665797739-1674de7a421a", 1600),
    work: u("1582719508461-905c673771fd", 1600),
    lounge: u("1578683010236-d716f9b3d461", 1600),
  },
  dining: {
    restaurant: u("1517248135467-4c7edcad34c4", 1800),
    table: u("1414235077428-338989a2e8c0", 1800),
    plate: u("1546069901-ba9599a7e63c", 1200),
    cocktail: u("1551024709-8f23befc6f87", 1200),
    chef: u("1577219491135-ce3919fb35d3", 1800),
    ambience: u("1559329007-40df8a9345d8", 1800),
    breakfast: u("1525351484163-7529414344d8", 1200),
    dessert: u("1488477181946-6428a0291777", 1200),
    biryani: u("1589302168068-964664d93dc0", 1200),
    thali: u("1567337710282-00832b415979", 1200),
    indian: u("1596797038530-2c107229654b", 1200),
    chinese: u("1525755662778-989d0524087e", 1200),
    soups: u("1547592166-23ac45744ac6", 1200),
    bread: u("1565299624946-b28f40a0ae38", 1200),
    coffee: u("1495474472287-4d71bcdd2085", 1200),
    drinks: u("1544145945-f90425340c7e", 1200),
    barLounge: u("1572116469696-31de0f17cc34", 1800),
    liveMusic: u("1514525253161-7a46d19cd819", 1800),
  },
  amenities: {
    pool: u("1571896349842-33c89424de2d", 1200),
    spa: u("1540555700478-4be289fbecef", 1200),
    gym: u("1571019613454-1cb2f99b2d8b", 1200),
    parking: u("1545179605-1296651e9d43", 1200),
    wifi: u("1551434678-e076c223a692", 1200),
    conference: u("1505373877841-8d25f7d46678", 1200),
    garden: u("1542317854-9c3a90e3e8b8", 1200),
    reception: u("1564501049412-61c2a3083791", 1200),
  },
  gallery: {
    exteriorDay: u("1455587734955-081b22074882", 1600),
    exteriorNight: u("1542314831-068cd1dbfeeb", 1600),
    lobby: u("1564013799919-ab600027ffc6", 1600),
    pool: u("1540541338287-41700207dee6", 1600),
    restaurant: u("1517248135467-4c7edcad34c4", 1600),
    bar: u("1572116469696-31de0f17cc34", 1600),
    suite: u("1582719478250-c89cae4dc85b", 1600),
    room: u("1631049307264-da0ec9d70304", 1600),
    breakfast: u("1525351484163-7529414344d8", 1600),
    plate: u("1546069901-ba9599a7e63c", 1600),
    cocktail: u("1551024709-8f23befc6f87", 1600),
    citySky: u("1582719508461-905c673771fd", 1600),
    details: u("1556909114-f6e7ad7d3136", 1600),
    service: u("1551632436-cbf8dd35adfa", 1600),
    food: u("1414235077428-338989a2e8c0", 1600),
    spa: u("1540555700478-4be289fbecef", 1600),
  },
  location: {
    hazaribagh: u("1599661046827-7bc4b9fafe9f", 1800),
    canaryHill: u("1502082553048-f009c37129b9", 1800),
  },
} as const;