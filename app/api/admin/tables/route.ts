import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { customAlphabet } from "nanoid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const nano = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 22);

const Body = z.object({
  label: z.string().min(1).max(40),
  zone: z.string().max(40).optional().nullable(),
});

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tables = await prisma.table.findMany({
    orderBy: [{ active: "desc" }, { label: "asc" }],
    include: { qrTokens: { where: { active: true }, take: 1 } },
  });
  return NextResponse.json({ tables });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const table = await prisma.table.create({
    data: {
      label: body.label,
      slug: slug(body.label),
      zone: body.zone ?? null,
    },
  });
  await prisma.tableQrToken.create({
    data: { tableId: table.id, token: nano() },
  });
  return NextResponse.json({ table });
}