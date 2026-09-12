import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { readTableSessionCookie, resolveTableByToken } from "@/lib/tableToken";
import { priceOrder, generateShortCode } from "@/lib/orderPricing";
import { hashIp } from "@/lib/ipHash";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LineSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive().max(50),
  notes: z.string().max(500).optional(),
});

const Body = z.object({
  items: z.array(LineSchema).min(1).max(50),
  notes: z.string().max(500).optional(),
  // Optional. May also come from `?tableToken=` or the session cookie.
  tableToken: z.string().min(6).max(40).optional(),
});

export async function POST(req: Request) {
  // Identify table either from request body token (preferred for QR) or session cookie.
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const url = new URL(req.url);
  const bodyToken =
    typeof (body as any).tableToken === "string"
      ? ((body as any).tableToken as string)
      : url.searchParams.get("tableToken");
  const cookieToken = readTableSessionCookie();

  const tokenToUse = body.tableToken || cookieToken;
  if (!tokenToUse) {
    return NextResponse.json(
      { error: "Missing table token. Please scan the QR code on your table." },
      { status: 400 },
    );
  }

  const resolved = await resolveTableByToken(tokenToUse);
  if (!resolved) {
    return NextResponse.json(
      { error: "Table token is invalid or has been disabled." },
      { status: 403 },
    );
  }

  let totals;
  try {
    totals = await priceOrder(body.items);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Could not price order" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = ip ? hashIp(ip) : null;

  // Generate a unique short code with up to 3 retries on collision.
  let shortCode = generateShortCode();
  let saved;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      saved = await prisma.order.create({
        data: {
          shortCode,
          tableId: resolved.table.id,
          status: "RECEIVED",
          subtotalPaise: totals.subtotalPaise,
          taxPaise: totals.taxPaise,
          totalPaise: totals.totalPaise,
          notes: body.notes ?? null,
          ipHash,
          items: {
            create: totals.lines.map((l) => ({
              menuItemId: l.menuItemId,
              nameSnapshot: l.nameSnapshot,
              unitPricePaise: l.unitPricePaise,
              quantity: l.quantity,
              notes: l.notes ?? null,
            })),
          },
        },
        include: { items: true, table: true },
      });
      break;
    } catch (err: any) {
      // Unique violation on shortCode → retry
      if (err?.code === "P2002" && attempt < 2) {
        shortCode = generateShortCode();
        continue;
      }
      throw err;
    }
  }
  if (!saved) {
    return NextResponse.json({ error: "Could not save order" }, { status: 500 });
  }

  return NextResponse.json({
    order: {
      id: saved.id,
      shortCode: saved.shortCode,
      status: saved.status,
      tableLabel: saved.table.label,
      subtotalPaise: saved.subtotalPaise,
      taxPaise: saved.taxPaise,
      totalPaise: saved.totalPaise,
      notes: saved.notes,
      createdAt: saved.createdAt,
      items: saved.items.map((i) => ({
        id: i.id,
        name: i.nameSnapshot,
        quantity: i.quantity,
        unitPricePaise: i.unitPricePaise,
      })),
    },
  });
}