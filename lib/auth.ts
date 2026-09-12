// Admin auth: bcryptjs password hashing + JWT in httpOnly cookie.
// Stateless — works on serverless (no session store required).

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const ALG = "HS256";
const COOKIE = "ci_admin";
const TTL_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("AUTH_SECRET is missing or too short — set a 32+ char string in .env");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signAdminToken(payload: { sub: string; email: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<{ sub: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email, role: String(payload.role ?? "STAFF") };
  } catch {
    return null;
  }
}

/** Returns the verified admin session or null. Safe to call from server components and route handlers. */
export async function getAdminSession() {
  const jar = cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const claims = await verifyAdminToken(token);
  if (!claims) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: claims.sub } });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function setAdminCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function clearAdminCookie() {
  cookies().set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Throws Response 401 if not admin — for use inside route handlers. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return session;
}

/** Rate limiter for auth endpoints. Per-IP in-memory bucket — adequate for this scale. */
const _rl: Map<string, { count: number; resetAt: number }> = (globalThis as any).__rl ?? new Map();
(globalThis as any).__rl = _rl;

export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const slot = _rl.get(key);
  if (!slot || slot.resetAt < now) {
    _rl.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (slot.count >= limit) return false;
  slot.count += 1;
  return true;
}