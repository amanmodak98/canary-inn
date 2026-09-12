import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(800).optional().nullable(),
  maxGuests: z.number().int().positive().optional().nullable(),
  sizeSqft: z.number().int().positive().optional().nullable(),
  bedType: z.string().max(40).optional().nullable(),
  basePricePaise: z.number().int().nonnegative().optional().nullable(),
  heroImage: z.string().url().optional().nullable().or(z.literal("")),
});

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rooms = await prisma.room.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json({ rooms });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid room" }, { status: 400 });
  }
  const last = await prisma.room.findFirst({ orderBy: { displayOrder: "desc" } });
  const room = await prisma.room.create({
    data: {
      name: body.name,
      slug: slug(body.name),
      description: body.description ?? null,
      maxGuests: body.maxGuests ?? null,
      sizeSqft: body.sizeSqft ?? null,
      bedType: body.bedType ?? null,
      basePricePaise: body.basePricePaise ?? null,
      heroImage: body.heroImage || null,
      displayOrder: (last?.displayOrder ?? -1) + 1,
    },
  });
  return NextResponse.json({ room });
}