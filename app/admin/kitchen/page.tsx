import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KitchenDisplay from "@/components/admin/KitchenDisplay";

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const orders = await prisma.order.findMany({
    where: { status: { in: ["RECEIVED", "CONFIRMED", "PREPARING", "READY"] } },
    orderBy: { createdAt: "asc" },
    include: { items: true, table: true },
  });

  const initial = orders.map((o) => ({
    id: o.id,
    shortCode: o.shortCode,
    tableLabel: o.table.label,
    status: o.status as any,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      name: i.nameSnapshot,
      quantity: i.quantity,
    })),
  }));

  return <KitchenDisplay initial={initial} />;
}