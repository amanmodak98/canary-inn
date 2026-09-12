// Serverless-compatible scheduled retention cleanup.
//
// Vercel Cron will call this daily at 03:00 UTC (see vercel.json).
// Can also be invoked manually:
//   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
//        $NEXT_PUBLIC_SITE_URL/api/cron/cleanup-orders
//
// Auth: Authorization: Bearer <CRON_SECRET>

import { NextResponse } from "next/server";
import { purgeOldOrders } from "@/lib/retention";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorize(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("bearer ")) return false;
  return header.slice("bearer ".length).trim() === secret;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await purgeOldOrders();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error("retention cleanup failed", e);
    return NextResponse.json({ error: "retention failed" }, { status: 500 });
  }
}

// Vercel Cron sends GET requests too — same handler.
export const GET = POST;