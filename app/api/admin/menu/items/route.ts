import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Body = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  pricePaise: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid menu item", details: e?.errors }, { status: 400 });
  }

  const slug = slugify(body.name);
  const last = await prisma.menuItem.findFirst({
    where: { categoryId: body.categoryId },
    orderBy: { displayOrder: "desc" },
  });
  const displayOrder = (last?.displayOrder ?? -1) + 1;

  try {
    const created = await prisma.menuItem.create({
      data: {
        categoryId: body.categoryId,
        name: body.name,
        slug,
        description: body.description ?? null,
        pricePaise: body.pricePaise,
        imageUrl: body.imageUrl || null,
        isVeg: body.isVeg,
        isAvailable: body.isAvailable,
        displayOrder,
      },
    });
    return NextResponse.json({ item: created });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "An item with this name already exists in the category" }, { status: 409 });
    }
    throw e;
  }
}