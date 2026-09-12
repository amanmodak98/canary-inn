/**
 * Seed script — populates the database with verified hotel data,
 * a default admin user, 12 tables with secure tokens, rooms,
 * amenities, menu categories and items.
 *
 * Run with: npm run db:seed
 *
 * Idempotent — safe to re-run.
 */

import { PrismaClient, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import { HOTEL } from "../data/hotel";
import { ROOMS } from "../data/rooms";
import { AMENITIES } from "../data/amenities";
import { MENU_CATEGORIES, MENU_ITEMS } from "../data/menu";
import { GALLERY } from "../data/gallery";

const prisma = new PrismaClient();
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const nano = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 22);

async function main() {
  console.log("→ Seeding Canary Inn Hazaribagh …");

  // ADMIN USER
  const adminEmail = "admin@canaryinn.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "CanaryInn#2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Canary Inn Manager",
      passwordHash,
      role: "OWNER",
    },
  });
  console.log(`  · admin user: ${admin.email} (password: ${adminPassword})`);

  // TABLES + QR TOKENS — 12 restaurant tables, each with a fresh secure token.
  const TABLES = [
    { label: "Table 01", zone: "Indoor" },
    { label: "Table 02", zone: "Indoor" },
    { label: "Table 03", zone: "Indoor" },
    { label: "Table 04", zone: "Indoor" },
    { label: "Table 05", zone: "Window" },
    { label: "Table 06", zone: "Window" },
    { label: "Table 07", zone: "Window" },
    { label: "Table 08", zone: "Lounge" },
    { label: "Table 09", zone: "Lounge" },
    { label: "Table 10", zone: "Garden" },
    { label: "Table 11", zone: "Garden" },
    { label: "Table 12", zone: "Garden" },
  ];

  for (const t of TABLES) {
    const table = await prisma.table.upsert({
      where: { slug: slug(t.label) },
      update: { label: t.label, zone: t.zone, active: true },
      create: { label: t.label, slug: slug(t.label), zone: t.zone, active: true },
    });
    // Ensure exactly one active token per table.
    await prisma.tableQrToken.deleteMany({ where: { tableId: table.id } });
    await prisma.tableQrToken.create({
      data: {
        tableId: table.id,
        token: nano(),
        active: true,
      },
    });
  }
  console.log(`  · ${TABLES.length} tables + QR tokens created`);

  // ROOMS
  for (let i = 0; i < ROOMS.length; i++) {
    const r = ROOMS[i];
    await prisma.room.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        description: r.description,
        maxGuests: r.maxGuests,
        sizeSqft: r.sizeSqft,
        bedType: r.bedType,
        heroImage: r.heroImage,
        displayOrder: i,
        active: true,
      },
      create: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        basePricePaise: r.basePricePaise,
        maxGuests: r.maxGuests,
        sizeSqft: r.sizeSqft,
        bedType: r.bedType,
        heroImage: r.heroImage,
        displayOrder: i,
        active: true,
      },
    });
    // Reset amenities to the canonical list for that room.
    const room = await prisma.room.findUnique({ where: { slug: r.slug } });
    if (room) {
      await prisma.roomAmenity.deleteMany({ where: { roomId: room.id } });
      for (const a of r.amenities) {
        await prisma.roomAmenity.create({ data: { roomId: room.id, name: a } });
      }
    }
  }
  console.log(`  · ${ROOMS.length} room categories + amenities`);

  // HOTEL AMENITIES
  for (let i = 0; i < AMENITIES.length; i++) {
    const a = AMENITIES[i];
    await prisma.hotelAmenity.upsert({
      where: { id: `seed-${i}` },
      update: { name: a.name, icon: a.icon, description: a.description, displayOrder: i, active: true },
      create: { id: `seed-${i}`, name: a.name, icon: a.icon, description: a.description, displayOrder: i, active: true },
    });
  }
  console.log(`  · ${AMENITIES.length} hotel amenities`);

  // MENU CATEGORIES + ITEMS
  for (const cat of MENU_CATEGORIES) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, displayOrder: cat.displayOrder, active: true },
      create: { slug: cat.slug, name: cat.name, description: cat.description, displayOrder: cat.displayOrder, active: true },
    });
    const items = MENU_ITEMS.filter((i) => i.category === cat.slug);
    let order = 0;
    for (const it of items) {
      const itemSlug = slug(it.name);
      await prisma.menuItem.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: itemSlug } },
        update: {
          name: it.name,
          description: it.description,
          pricePaise: Math.round(it.price * 100),
          imageUrl: it.imageUrl ?? null,
          isVeg: it.isVeg,
          isAvailable: true,
          displayOrder: order++,
          active: true,
        },
        create: {
          categoryId: category.id,
          slug: itemSlug,
          name: it.name,
          description: it.description,
          pricePaise: Math.round(it.price * 100),
          imageUrl: it.imageUrl ?? null,
          isVeg: it.isVeg,
          isAvailable: true,
          displayOrder: order++,
          active: true,
        },
      });
    }
  }
  console.log(`  · ${MENU_CATEGORIES.length} categories, ${MENU_ITEMS.length} items`);

  // GALLERY
  for (let i = 0; i < GALLERY.length; i++) {
    const g = GALLERY[i];
    await prisma.galleryItem.upsert({
      where: { id: `seed-gallery-${i}` },
      update: { caption: g.caption, imageUrl: g.imageUrl, category: g.category, displayOrder: i, active: true },
      create: { id: `seed-gallery-${i}`, caption: g.caption, imageUrl: g.imageUrl, category: g.category, displayOrder: i, active: true },
    });
  }
  console.log(`  · ${GALLERY.length} gallery items`);

  console.log("\n✔ Seed complete.");
  console.log(`  Hotel: ${HOTEL.name}`);
  console.log(`  Address: ${HOTEL.address.line1}, ${HOTEL.address.city}`);
  console.log(`  Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().then(() => process.exit(1));
  });