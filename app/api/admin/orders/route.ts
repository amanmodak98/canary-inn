import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: true,
      table: true,
    },
  });
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      shortCode: o.shortCode,
      tableId: o.tableId,
      tableLabel: o.table.label,
      status: o.status,
      subtotalPaise: o.subtotalPaise,
      taxPaise: o.taxPaise,
      totalPaise: o.totalPaise,
      notes: o.notes,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      items: o.items.map((i) => ({
        id: i.id,
        name: i.nameSnapshot,
        quantity: i.quantity,
        unitPricePaise: i.unitPricePaise,
        notes: i.notes,
      })),
    })),
  });
}