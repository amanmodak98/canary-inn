import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupees, shortTime, elapsed } from "@/lib/utils";
import {
  ClipboardList,
  ChefHat,
  IndianRupee,
  TrendingUp,
  QrCode,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [activeOrders, allTables, todayOrders, activeTables] = await Promise.all([
    prisma.order.count({
      where: { status: { in: ["RECEIVED", "CONFIRMED", "PREPARING", "READY"] } },
    }),
    prisma.table.count({ where: { active: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: since } },
      include: { items: true, table: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.order.findMany({
      where: { status: { in: ["RECEIVED", "CONFIRMED", "PREPARING", "READY"] } },
      include: { table: true },
      distinct: ["tableId"],
    }),
  ]);

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + o.totalPaise, 0);
  const itemsToday = todayOrders.reduce(
    (acc, o) => acc + o.items.reduce((a, i) => a + i.quantity, 0),
    0,
  );

  const tiles = [
    { Icon: ClipboardList, label: "Active orders", value: String(activeOrders), href: "/admin/orders" },
    { Icon: ChefHat, label: "Tables in service", value: `${activeTables.length} / ${allTables}`, href: "/admin/tables" },
    { Icon: IndianRupee, label: "Today's revenue", value: formatRupees(todayRevenue), href: "/admin/dashboard" },
    { Icon: TrendingUp, label: "Items served today", value: String(itemsToday), href: "/admin/dashboard" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div>
        <div className="eyebrow text-ash">Dashboard</div>
        <h1 className="mt-2 font-serif text-3xl text-coal">Welcome, {session.name.split(" ")[0]}.</h1>
        <p className="mt-2 text-coal/70 max-w-2xl">
          A quick look at today. Open the Orders board for live table-wise activity, or head to the Kitchen screen to mark items as they go out.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(({ Icon, label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-ivory border border-coal/10 p-6 hover:border-coal/30 transition-colors"
          >
            <Icon size={20} className="text-ember" />
            <div className="mt-4 font-serif text-3xl text-coal">{value}</div>
            <div className="mt-1 eyebrow">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-ivory border border-coal/10 p-6">
          <div className="flex items-center justify-between">
            <div className="eyebrow">Recent activity</div>
            <Link href="/admin/orders" className="text-sm text-ember hover:underline">View all →</Link>
          </div>
          <ul className="mt-4 divide-y divide-coal/5">
            {todayOrders.slice(0, 8).map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{o.shortCode} · {o.table.label}</div>
                  <div className="text-coal/55 text-xs">
                    {o.items.length} item{o.items.length === 1 ? "" : "s"} · {elapsed(o.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={o.status} />
                  <span className="font-serif">{formatRupees(o.totalPaise)}</span>
                </div>
              </li>
            ))}
            {todayOrders.length === 0 && (
              <li className="py-8 text-center text-coal/55 text-sm">No orders today.</li>
            )}
          </ul>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Link
            href="/admin/orders"
            className="block bg-coal text-ivory p-6 hover:bg-espresso transition-colors"
          >
            <ClipboardList size={20} />
            <div className="mt-3 font-serif text-xl">Open the live order board</div>
            <div className="mt-1 text-ivory/70 text-sm">Grouped by table · status updates every few seconds.</div>
          </Link>
          <Link
            href="/admin/kitchen"
            className="block border border-coal/15 p-6 hover:border-coal/40 transition-colors"
          >
            <ChefHat size={20} className="text-ember" />
            <div className="mt-3 font-serif text-xl">Kitchen display</div>
            <div className="mt-1 text-coal/65 text-sm">High-contrast, touch-first screen for the line.</div>
          </Link>
          <Link
            href="/admin/tables"
            className="block border border-coal/15 p-6 hover:border-coal/40 transition-colors"
          >
            <QrCode size={20} className="text-ember" />
            <div className="mt-3 font-serif text-xl">Tables & QR codes</div>
            <div className="mt-1 text-coal/65 text-sm">Add, disable, regenerate or download.</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    RECEIVED: "bg-coal text-ivory",
    CONFIRMED: "bg-cream text-coal",
    PREPARING: "bg-ember text-ivory",
    READY: "bg-leaf text-ivory",
    SERVED: "bg-coal/70 text-ivory",
    CANCELLED: "bg-coal/20 text-coal",
  };
  return (
    <span className={`text-eyebrow uppercase tracking-widest px-2 py-0.5 rounded ${styles[status] ?? styles.RECEIVED}`}>
      {status}
    </span>
  );
}