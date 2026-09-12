import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Patch = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  pricePaise: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
  displayOrder: z.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: z.infer<typeof Patch>;
  try {
    body = Patch.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data: any = { ...body };
  if (body.imageUrl === "") data.imageUrl = null;

  const updated = await prisma.menuItem.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.menuItem.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}