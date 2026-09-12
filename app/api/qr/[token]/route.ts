// QR code PNG endpoint.
//   GET /api/qr/<token>?size=600
// Returns a PNG of the URL `${SITE}/menu?tableToken=<token>`.
// Used both for direct download from the admin UI and embedding into printable PDFs.

import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const url = new URL(req.url);
  const size = Math.min(1600, Math.max(120, Number(url.searchParams.get("size") ?? 600)));
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const target = `${site.replace(/\/$/, "")}/menu?tableToken=${encodeURIComponent(params.token)}`;

  const png = await QRCode.toBuffer(target, {
    type: "png",
    width: size,
    margin: 2,
    color: { dark: "#1C1611", light: "#FAF7F2" },
  });
  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600",
    },
  });
}