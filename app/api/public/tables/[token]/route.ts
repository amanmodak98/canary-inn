// Validate a QR table token, set the table session cookie, return the table label.
// This is the single source of truth for which table a guest is ordering from.

import { NextResponse } from "next/server";
import { resolveTableByToken, setTableSessionCookie } from "@/lib/tableToken";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const token = params.token;
  if (!token || token.length < 6) {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }
  const record = await resolveTableByToken(token);
  if (!record) {
    return NextResponse.json({ error: "Token not recognised" }, { status: 404 });
  }
  setTableSessionCookie(token);
  return NextResponse.json({
    table: { id: record.table.id, label: record.table.label, zone: record.table.zone },
  });
}