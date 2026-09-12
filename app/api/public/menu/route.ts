import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.menuItem.findMany({
      where: { active: true, isAvailable: true },
      orderBy: [{ categoryId: "asc" }, { displayOrder: "asc" }],
    }),
  ]);

  const itemsByCategory = new Map<string, typeof items>();
  for (const it of items) {
    if (!itemsByCategory.has(it.categoryId)) itemsByCategory.set(it.categoryId, []);
    itemsByCategory.get(it.categoryId)!.push(it);
  }

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      displayOrder: c.displayOrder,
    })),
    items: items.map((i) => ({
      id: i.id,
      categoryId: i.categoryId,
      name: i.name,
      description: i.description,
      pricePaise: i.pricePaise,
      imageUrl: i.imageUrl,
      isVeg: i.isVeg,
      isAvailable: i.isAvailable,
    })),
  });
}