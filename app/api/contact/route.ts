import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  subject: z.string().max(200).optional(),
  body: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  await prisma.contactMessage.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone ?? null,
      subject: parsed.subject ?? null,
      body: parsed.body,
    },
  });
  return NextResponse.json({ ok: true });
}