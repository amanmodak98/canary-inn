"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { formatRupees, shortTime } from "@/lib/utils";

type Status = "RECEIVED" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
const STEPS: Status[] = ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "SERVED"];

type OrderData = {
  id: string;
  shortCode: string;
  status: Status;
  tableLabel: string;
  totalPaise: number;
  createdAt: string;
  items: { id: string; name: string; quantity: number; unitPricePaise: number }[];
};

export default function OrderStatusTracker({ id, initial }: { id: string; initial: OrderData }) {
  const [order, setOrder] = useState<OrderData>(initial);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/public/orders/${id}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setOrder(data.order);
      } catch {}
    };
    const t = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [id]);

  const idx = STEPS.indexOf(order.status);
  const cancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-coal text-ivory">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link href="/" className="text-eyebrow uppercase tracking-widest text-ivory/60 hover:text-ivory">
            ← Canary Inn
          </Link>
          <div className="mt-3 text-eyebrow uppercase tracking-widest text-ember">Order received</div>
          <h1 className="mt-2 font-serif text-3xl text-ivory">{order.shortCode}</h1>
          <div className="mt-2 flex items-center gap-3 text-ivory/70 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-ember" /> {order.tableLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-ember" /> {shortTime(order.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {cancelled ? (
          <div className="bg-ember/10 text-ember p-5 rounded-2xl text-center">
            This order was cancelled.
          </div>
        ) : (
          <ol className="relative space-y-5">
            {STEPS.map((s, i) => {
              const reached = i <= idx;
              const current = i === idx;
              return (
                <li key={s} className="flex items-start gap-4">
                  <div className="relative">
                    <motion.div
                      initial={false}
                      animate={{ scale: current ? 1.1 : 1 }}
                      className={`w-9 h-9 rounded-full inline-flex items-center justify-center border-2 ${
                        reached
                          ? "bg-ember border-ember text-ivory"
                          : "bg-ivory border-coal/20 text-coal/40"
                      }`}
                    >
                      {reached && !current ? <Check size={16} /> : current ? <Loader2 size={16} className="animate-spin" /> : i + 1}
                    </motion.div>
                    {i < STEPS.length - 1 && (
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 top-9 w-0.5 h-10 ${
                          reached ? "bg-ember/40" : "bg-coal/10"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${reached ? "text-coal" : "text-coal/40"}`}>{labelFor(s)}</div>
                    {current && (
                      <div className="text-sm text-ember mt-0.5">In progress…</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <div className="mt-10">
          <div className="eyebrow">Order summary</div>
          <ul className="mt-4 space-y-2">
            {order.items.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between py-2 border-b border-coal/10 text-sm"
              >
                <span>
                  {l.quantity} × {l.name}
                </span>
                <span className="font-medium">{formatRupees(l.unitPricePaise * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between font-serif text-xl">
            <span>Total</span>
            <span>{formatRupees(order.totalPaise)}</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function labelFor(s: Status): string {
  switch (s) {
    case "RECEIVED":
      return "Order received";
    case "CONFIRMED":
      return "Confirmed by kitchen";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready to serve";
    case "SERVED":
      return "Served";
    case "CANCELLED":
      return "Cancelled";
  }
}