import { prisma } from "@/lib/prisma";
import OrderStatusTracker from "@/components/order/OrderStatusTracker";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: params.id }, { shortCode: params.id }] },
    include: { items: true, table: true },
  });
  if (!order) return notFound();

  return (
    <OrderStatusTracker
      id={order.id}
      initial={{
        id: order.id,
        shortCode: order.shortCode,
        status: order.status as any,
        tableLabel: order.table.label,
        totalPaise: order.totalPaise,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((i) => ({
          id: i.id,
          name: i.nameSnapshot,
          quantity: i.quantity,
          unitPricePaise: i.unitPricePaise,
        })),
      }}
    />
  );
}