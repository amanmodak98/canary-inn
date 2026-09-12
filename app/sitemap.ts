import type { MetadataRoute } from "next";
import { HOTEL } from "@/lib/hotel";
import { ROOMS } from "@/data/rooms";
import { MENU_CATEGORIES } from "@/data/menu";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const base = site.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/rooms", "/dining", "/menu", "/experience", "/gallery", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const roomRoutes = ROOMS.map((r) => ({
    url: `${base}/rooms/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const menuRoutes = MENU_CATEGORIES.map((c) => ({
    url: `${base}/menu/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...roomRoutes, ...menuRoutes];
}