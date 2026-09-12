import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { customAlphabet } from "nanoid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const nano = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 22);

const Patch = z.object({
  label: z.string().min(1).max(40).optional(),
  zone: z.string().max(40).optional().nullable(),
  active: z.boolean().optional(),
  regenerateToken: z.boolean().optional(),
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

  const data: any = {};
  if (body.label) data.label = body.label;
  if (body.zone !== undefined) data.zone = body.zone;
  if (body.active !== undefined) data.active = body.active;

  const table = await prisma.table.update({ where: { id: params.id }, data });

  if (body.regenerateToken) {
    await prisma.tableQrToken.updateMany({
      where: { tableId: table.id, active: true },
      data: { active: false },
    });
    await prisma.tableQrToken.create({ data: { tableId: table.id, token: nano() } });
  }
  return NextResponse.json({ table });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.table.update({ where: { id: params.id }, data: { active: false } });
  await prisma.tableQrToken.updateMany({ where: { tableId: params.id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}