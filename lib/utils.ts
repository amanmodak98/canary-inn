// Pure utility helpers used across server + client code.

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatRupees(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatRupeesPlain(paise: number): string {
  const rupees = Math.round(paise / 100);
  return rupees.toLocaleString("en-IN");
}

export function paiseFromRupees(rupees: number): number {
  return Math.round(rupees * 100);
}

export function shortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function shortTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function elapsed(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}