import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUSES = ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "SERVED", "CANCELLED"] as const;

const Body = z.object({
  status: z.enum(STATUSES),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status: body.status },
    select: { id: true, status: true, updatedAt: true },
  });
  return NextResponse.json({ order: updated });
}