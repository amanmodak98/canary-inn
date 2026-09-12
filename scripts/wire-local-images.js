#!/usr/bin/env node
/**
 * Scan /public/hotel/ for local photo files, and rewrite the URLs in
 * data/images.ts so each present file replaces its Unsplash fallback.
 * When a previously-wired file is removed, the slot reverts to its fallback.
 *
 * Idempotent and bidirectional. Drop a file → wire runs → local path baked
 * in. Delete the file → wire runs → fallback restored.
 *
 * Usage:
 *   node scripts/wire-local-images.js            # wire what's present
 *   node scripts/wire-local-images.js --status   # show only, no writes
 *   npm run images:wire                          # same as no flags
 *   npm run images:status                        # same as --status
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HOTEL_DIR = path.join(ROOT, "public", "hotel");
const IMAGES_FILE = path.join(ROOT, "data", "images.ts");
const SUPPORTED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

// Canonical fallback Unsplash URLs. Authoritative — the wire script writes
// these back when the local file is missing. Keep in sync with the IDs
// originally used in data/images.ts.
const FALLBACKS = {
  "hero.primary": { id: "1564013799919-ab600027ffc6", w: 2400 },
  "hero.secondary": { id: "1551882547-ff40c63fe5fa", w: 2400 },
  "rooms.standard": { id: "1631049307264-da0ec9d70304", w: 1600 },
  "rooms.deluxe": { id: "1611892440504-42a792e24d32", w: 1600 },
  "rooms.superDeluxe": { id: "1590490360182-c33d57733427", w: 1600 },
  "rooms.suite": { id: "1582719478250-c89cae4dc85b", w: 1600 },
  "rooms.bed": { id: "1505693416388-ac5ce068fe85", w: 1600 },
  "rooms.bath": { id: "1552321554-5fefe8c9ef14", w: 1600 },
  "rooms.interior": { id: "1631049552057-403cdb8f0658", w: 1600 },
  "rooms.window": { id: "1566665797739-1674de7a421a", w: 1600 },
  "rooms.work": { id: "1582719508461-905c673771fd", w: 1600 },
  "rooms.lounge": { id: "1578683010236-d716f9b3d461", w: 1600 },
  "dining.restaurant": { id: "1517248135467-4c7edcad34c4", w: 1800 },
  "dining.table": { id: "1414235077428-338989a2e8c0", w: 1800 },
  "dining.plate": { id: "1546069901-ba9599a7e63c", w: 1200 },
  "dining.cocktail": { id: "1551024709-8f23befc6f87", w: 1200 },
  "dining.chef": { id: "1577219491135-ce3919fb35d3", w: 1800 },
  "dining.ambience": { id: "1559329007-40df8a9345d8", w: 1800 },
  "dining.breakfast": { id: "1525351484163-7529414344d8", w: 1200 },
  "dining.dessert": { id: "1488477181946-6428a0291777", w: 1200 },
  "dining.biryani": { id: "1589302168068-964664d93dc0", w: 1200 },
  "dining.thali": { id: "1567337710282-00832b415979", w: 1200 },
  "dining.indian": { id: "1596797038530-2c107229654b", w: 1200 },
  "dining.chinese": { id: "1525755662778-989d0524087e", w: 1200 },
  "dining.soups": { id: "1547592166-23ac45744ac6", w: 1200 },
  "dining.bread": { id: "1565299624946-b28f40a0ae38", w: 1200 },
  "dining.coffee": { id: "1495474472287-4d71bcdd2085", w: 1200 },
  "dining.drinks": { id: "1544145945-f90425340c7e", w: 1200 },
  "dining.barLounge": { id: "1572116469696-31de0f17cc34", w: 1800 },
  "dining.liveMusic": { id: "1514525253161-7a46d19cd819", w: 1800 },
  "amenities.pool": { id: "1571896349842-33c89424de2d", w: 1200 },
  "amenities.spa": { id: "1540555700478-4be289fbecef", w: 1200 },
  "amenities.gym": { id: "1571019613454-1cb2f99b2d8b", w: 1200 },
  "amenities.parking": { id: "1545179605-1296651e9d43", w: 1200 },
  "amenities.wifi": { id: "1551434678-e076c223a692", w: 1200 },
  "amenities.conference": { id: "1505373877841-8d25f7d46678", w: 1200 },
  "amenities.garden": { id: "1542317854-9c3a90e3e8b8", w: 1200 },
  "amenities.reception": { id: "1564501049412-61c2a3083791", w: 1200 },
  "gallery.exteriorDay": { id: "1455587734955-081b22074882", w: 1600 },
  "gallery.exteriorNight": { id: "1542314831-068cd1dbfeeb", w: 1600 },
  "gallery.lobby": { id: "1564013799919-ab600027ffc6", w: 1600 },
  "gallery.pool": { id: "1540541338287-41700207dee6", w: 1600 },
  "gallery.restaurant": { id: "1517248135467-4c7edcad34c4", w: 1600 },
  "gallery.bar": { id: "1572116469696-31de0f17cc34", w: 1600 },
  "gallery.suite": { id: "1582719478250-c89cae4dc85b", w: 1600 },
  "gallery.room": { id: "1631049307264-da0ec9d70304", w: 1600 },
  "gallery.breakfast": { id: "1525351484163-7529414344d8", w: 1600 },
  "gallery.plate": { id: "1546069901-ba9599a7e63c", w: 1600 },
  "gallery.cocktail": { id: "1551024709-8f23befc6f87", w: 1600 },
  "gallery.citySky": { id: "1582719508461-905c673771fd", w: 1600 },
  "gallery.details": { id: "1556909114-f6e7ad7d3136", w: 1600 },
  "gallery.service": { id: "1551632436-cbf8dd35adfa", w: 1600 },
  "gallery.food": { id: "1414235077428-338989a2e8c0", w: 1600 },
  "gallery.spa": { id: "1540555700478-4be289fbecef", w: 1600 },
  "location.hazaribagh": { id: "1599661046827-7bc4b9fafe9f", w: 1800 },
  "location.canaryHill": { id: "1502082553048-f009c37129b9", w: 1800 },
};

// Map of slot → local-file basename. Mirrors /public/hotel/DROPPOINT.md.
// Convention: file basename is the section name (with trailing 's' stripped
// when it would otherwise duplicate, e.g. rooms → room) followed by the key
// in kebab-case. Aliases (e.g. gallery.suite → room-suite) share basenames
// so dropping one file wires multiple slots.
const SLOT_TO_FILE = {
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

function findFile(base) {
  for (const ext of SUPPORTED_EXT) {
    const p = path.join(HOTEL_DIR, base + ext);
    if (fs.existsSync(p)) return base + ext;
  }
  return null;
}

function fallbackExpr(slot) {
  const { id, w } = FALLBACKS[slot];
  return `u("${id}", ${w})`;
}

function status() {
  const entries = Object.entries(SLOT_TO_FILE);
  const present = entries
    .map(([slot, base]) => ({ slot, base, file: findFile(base) }))
    .filter((x) => x.file);
  const missing = entries.filter(([, base]) => !findFile(base));
  console.log(`\nHotel photos in ${path.relative(ROOT, HOTEL_DIR)}/`);
  console.log("─".repeat(50));
  console.log(`Local: ${present.length} / ${entries.length}  ·  Unsplash fallback: ${missing.length}\n`);
  if (present.length) {
    console.log("✓ Wired to local photos:");
    for (const { slot, file } of present) console.log(`   ${slot.padEnd(28)} → /hotel/${file}`);
    console.log("");
  }
  if (missing.length) {
    console.log("· On Unsplash fallback (drop a file to override):");
    for (const [slot, base] of missing) console.log(`   ${slot.padEnd(28)} → /hotel/${base}.{jpg,png,webp}`);
    console.log("");
  }
}

function rewire() {
  if (!fs.existsSync(IMAGES_FILE)) {
    console.error(`Cannot find ${path.relative(ROOT, IMAGES_FILE)}`);
    process.exit(1);
  }
  let src = fs.readFileSync(IMAGES_FILE, "utf8");

  // Locate each section block (hero:, rooms:, dining:, amenities:, gallery:,
  // location:) so replacements stay section-scoped — prevents cross-section
  // collisions when the same key (pool, plate, suite, …) appears in more
  // than one section.
  const sectionRanges = {};
  const sectionRe = /^(\s{2})(\w+):\s*\{/gm;
  let match;
  while ((match = sectionRe.exec(src)) !== null) {
    const name = match[2];
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;
    while (i < src.length && depth > 0) {
      const ch = src[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      i++;
    }
    sectionRanges[name] = [start, i - 1];
  }

  // Collect (start, end, replacement) tuples so we can apply them in reverse
  // order — earlier replacements don't shift later positions.
  const edits = [];
  for (const [slot, base] of Object.entries(SLOT_TO_FILE)) {
    const [section, key] = slot.split(".");
    const range = sectionRanges[section];
    if (!range) continue;
    const file = findFile(base);
    const target = file ? `"/hotel/${file}"` : fallbackExpr(slot);

    const [sStart, sEnd] = range;
    const sectionSrc = src.slice(sStart, sEnd);
    const localRe = new RegExp(
      `(\\b${key}\\b\\s*:\\s*)(?:u\\(\\s*"[^"]+"\\s*(?:,\\s*\\d+\\s*)?\\)|"/hotel/[^"]+")`,
    );
    const m2 = localRe.exec(sectionSrc);
    if (!m2) continue;

    const replacement = m2[1] + target;
    // Skip no-ops (current value already matches the target).
    if (m2[0] === replacement) continue;

    const matchStart = sStart + m2.index;
    const matchEnd = sStart + m2.index + m2[0].length;
    edits.push({ start: matchStart, end: matchEnd, replacement });
  }

  if (edits.length === 0) {
    console.log("No changes — already up to date.");
    return;
  }

  // Apply in reverse so positions stay valid.
  edits.sort((a, b) => b.start - a.start);
  for (const { start, end, replacement } of edits) {
    src = src.slice(0, start) + replacement + src.slice(end);
  }

  fs.writeFileSync(IMAGES_FILE, src);
  console.log(`✓ Updated ${path.relative(ROOT, IMAGES_FILE)} (${edits.length} slot${edits.length === 1 ? "" : "s"})`);
}

function main() {
  if (!fs.existsSync(HOTEL_DIR)) {
    fs.mkdirSync(HOTEL_DIR, { recursive: true });
  }
  status();
  if (!process.argv.includes("--status")) {
    rewire();
  }
}

main();