"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { cn, formatRupees, elapsed } from "@/lib/utils";
import StatusPill from "./StatusPill";

type Status = "RECEIVED" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
type Item = { id: string; name: string; quantity: number; unitPricePaise: number };
type Order = {
  id: string;
  shortCode: string;
  tableId: string;
  tableLabel: string;
  status: Status;
  totalPaise: number;
  notes: string | null;
  createdAt: string;
  items: Item[];
};

const NEXT: Record<Status, Status[]> = {
  RECEIVED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["SERVED"],
  SERVED: [],
  CANCELLED: [],
};

export default function OrderBoard({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setOrders(data.orders ?? []);
      } catch {}
    };
    const t = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, Order[]>();
    for (const o of orders) {
      if (!m.has(o.tableLabel)) m.set(o.tableLabel, []);
      m.get(o.tableLabel)!.push(o);
    }
    return [...m.entries()].sort((a, b) => {
      const at = Math.max(...a[1].map((o) => new Date(o.createdAt).getTime()));
      const bt = Math.max(...b[1].map((o) => new Date(o.createdAt).getTime()));
      return bt - at;
    });
  }, [orders]);

  async function setStatus(id: string, status: Status) {
    setBusy((s) => new Set(s).add(id));
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      }
    } finally {
      setBusy((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-coal/20 p-12 text-center text-coal/55">
        No orders yet. As soon as a guest scans a QR and places an order, it will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(([tableLabel, list]) => (
        <div key={tableLabel}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-coal">{tableLabel}</h2>
            <div className="text-eyebrow uppercase tracking-widest text-ash">
              {list.length} active order{list.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((o) => (
              <article key={o.id} className="border border-coal/10 bg-ivory p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-eyebrow uppercase tracking-widest text-ash">Order</div>
                    <div className="font-serif text-xl">{o.shortCode}</div>
                  </div>
                  <StatusPill status={o.status} />
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-coal/55">
                  <Clock size={12} /> {elapsed(o.createdAt)}
                </div>

                <ul className="mt-4 space-y-1 text-sm">
                  {o.items.map((l) => (
                    <li key={l.id} className="flex justify-between">
                      <span className="text-coal">{l.quantity} × {l.name}</span>
                      <span className="text-coal/55">{formatRupees(l.unitPricePaise * l.quantity)}</span>
                    </li>
                  ))}
                </ul>

                {o.notes && (
                  <div className="mt-3 p-3 bg-cream text-xs text-coal/75 rounded">“{o.notes}”</div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-coal/10 pt-3">
                  <span className="font-serif text-lg">{formatRupees(o.totalPaise)}</span>
                </div>

                {NEXT[o.status].length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NEXT[o.status].map((s) => (
                      <button
                        key={s}
                        disabled={busy.has(o.id)}
                        onClick={() => setStatus(o.id, s)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium transition-colors",
                          s === "CANCELLED"
                            ? "border border-ember/50 text-ember hover:bg-ember hover:text-ivory"
                            : "bg-coal text-ivory hover:bg-ember",
                          busy.has(o.id) && "opacity-50 cursor-wait",
                        )}
                      >
                        {labelFor(s)} <ChevronRight size={12} className="inline" />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function labelFor(s: Status): string {
  return s === "RECEIVED" ? "Mark received" :
         s === "CONFIRMED" ? "Confirm" :
         s === "PREPARING" ? "Start preparing" :
         s === "READY" ? "Mark ready" :
         s === "SERVED" ? "Mark served" :
         "Cancel";
}