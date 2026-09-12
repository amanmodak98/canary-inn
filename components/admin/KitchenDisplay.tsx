"use client";

import { useEffect, useState } from "react";
import { cn, elapsed } from "@/lib/utils";

type Item = { id: string; name: string; quantity: number };
type Order = {
  id: string;
  shortCode: string;
  tableLabel: string;
  status: "RECEIVED" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  createdAt: string;
  items: Item[];
};

export default function KitchenDisplay({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setOrders(
          (data.orders ?? [])
            .filter((o: any) => ["RECEIVED", "CONFIRMED", "PREPARING", "READY"].includes(o.status))
            .map((o: any) => ({
              id: o.id,
              shortCode: o.shortCode,
              tableLabel: o.tableLabel,
              status: o.status,
              createdAt: o.createdAt,
              items: o.items.map((i: any) => ({ id: i.id, name: i.name, quantity: i.quantity })),
            })),
        );
      } catch {}
    };
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, []);

  // Force re-render every 30s to refresh "elapsed" timers.
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  async function setStatus(id: string, status: "RECEIVED" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED") {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div className="min-h-screen bg-coal text-ivory p-6 lg:p-10">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="font-serif text-3xl lg:text-4xl tracking-tightest">Kitchen</h1>
        <div className="text-eyebrow uppercase tracking-widest text-ivory/60">
          {orders.length} order{orders.length === 1 ? "" : "s"} · auto-refresh
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 text-center text-ivory/55 text-lg">No active orders.</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {orders.map((o) => (
            <article
              key={o.id}
              className={cn(
                "border-2 bg-ivory text-coal p-5",
                o.status === "PREPARING" && "border-ember",
                o.status === "READY" && "border-leaf",
                o.status === "RECEIVED" && "border-coal",
                o.status === "CONFIRMED" && "border-coal/40",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-eyebrow uppercase tracking-widest text-coal/60">Table</div>
                  <div className="font-serif text-3xl tracking-tightest">{o.tableLabel}</div>
                </div>
                <div className="text-right">
                  <div className="text-eyebrow uppercase tracking-widest text-coal/60">Order</div>
                  <div className="font-serif text-xl">{o.shortCode}</div>
                </div>
              </div>

              <div className="mt-2 text-eyebrow uppercase tracking-widest text-coal/60">
                {elapsed(o.createdAt)} ago
              </div>

              <ul className="mt-4 space-y-1 text-lg">
                {o.items.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span>
                      <span className="font-serif text-2xl">{l.quantity}</span> × {l.name}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-2">
                {o.status === "RECEIVED" && (
                  <button
                    onClick={() => setStatus(o.id, "CONFIRMED")}
                    className="w-full bg-coal text-ivory py-3 uppercase tracking-widest text-sm hover:bg-ember"
                  >
                    Acknowledge
                  </button>
                )}
                {o.status === "CONFIRMED" && (
                  <button
                    onClick={() => setStatus(o.id, "PREPARING")}
                    className="w-full bg-ember text-ivory py-3 uppercase tracking-widest text-sm hover:bg-coal"
                  >
                    Start preparing
                  </button>
                )}
                {o.status === "PREPARING" && (
                  <button
                    onClick={() => setStatus(o.id, "READY")}
                    className="w-full bg-leaf text-ivory py-3 uppercase tracking-widest text-sm"
                  >
                    Mark ready
                  </button>
                )}
                {o.status === "READY" && (
                  <button
                    onClick={() => setStatus(o.id, "SERVED")}
                    className="w-full bg-coal text-ivory py-3 uppercase tracking-widest text-sm"
                  >
                    Mark served
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}