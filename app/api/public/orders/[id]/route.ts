import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  // Accept either our cuid or the shortCode for guest lookups.
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { shortCode: id }] },
    include: { items: true, table: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({
    order: {
      id: order.id,
      shortCode: order.shortCode,
      status: order.status,
      tableLabel: order.table.label,
      subtotalPaise: order.subtotalPaise,
      taxPaise: order.taxPaise,
      totalPaise: order.totalPaise,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((i) => ({
        id: i.id,
        name: i.nameSnapshot,
        quantity: i.quantity,
        unitPricePaise: i.unitPricePaise,
        notes: i.notes,
      })),
    },
  });
}