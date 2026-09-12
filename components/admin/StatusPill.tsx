"use client";

import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  RECEIVED: "bg-coal text-ivory",
  CONFIRMED: "bg-cream text-coal border border-coal/15",
  PREPARING: "bg-ember text-ivory",
  READY: "bg-leaf text-ivory",
  SERVED: "bg-coal/70 text-ivory",
  CANCELLED: "bg-coal/15 text-coal/60",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("text-eyebrow uppercase tracking-widest px-2 py-0.5 rounded", styles[status] ?? styles.RECEIVED)}>
      {status}
    </span>
  );
}