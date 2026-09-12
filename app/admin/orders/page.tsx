import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderBoard from "@/components/admin/OrderBoard";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: true, table: true },
  });

  const initial = orders.map((o) => ({
    id: o.id,
    shortCode: o.shortCode,
    tableLabel: o.table.label,
    tableId: o.tableId,
    status: o.status as any,
    subtotalPaise: o.subtotalPaise,
    taxPaise: o.taxPaise,
    totalPaise: o.totalPaise,
    notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      name: i.nameSnapshot,
      quantity: i.quantity,
      unitPricePaise: i.unitPricePaise,
    })),
  }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow text-ash">Live orders</div>
          <h1 className="mt-2 font-serif text-3xl text-coal">All orders, by table.</h1>
        </div>
        <div className="text-eyebrow uppercase tracking-widest text-ash">
          Updates every 4 seconds
        </div>
      </div>
      <div className="mt-8">
        <OrderBoard initial={initial} />
      </div>
    </div>
  );
}