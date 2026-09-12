import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, signAdminToken, setAdminCookie, rateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(`login:${ip}`, 6, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email: body.email.toLowerCase() } });
  // Always run a bcrypt comparison to avoid revealing whether the account exists.
  const ok = await comparePassword(body.password, user?.passwordHash ?? "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsaltinvalidsaltin");
  if (!user || !ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = await signAdminToken({ sub: user.id, email: user.email, role: user.role });
  await setAdminCookie(token);
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } });
}