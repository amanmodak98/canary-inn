import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();
  const site =
    raw && /^https?:\/\//i.test(raw)
      ? raw
      : vercel
        ? `https://${vercel}`
        : "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: `${site.replace(/\/$/, "")}/sitemap.xml`,
  };
}