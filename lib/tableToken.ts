// Table token security.
//
// Tables are identified by a 22-char URL-safe nanoid token, NOT by their
// sequential label. The token is stored server-side and verified on every
// order submission, so guests cannot impersonate another table by editing
// the URL.

import { customAlphabet } from "nanoid";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE = "ci_table";
// URL-safe alphabet — no ambiguous chars.
const nano = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 22);

export function generateTableToken(): string {
  return nano();
}

export async function setTableSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function readTableSessionCookie(): string | null {
  return cookies().get(COOKIE)?.value ?? null;
}

export function clearTableSessionCookie() {
  cookies().set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Resolves a token to its active table. Returns null if the token is
 * unknown, rotated out, or the table has been disabled.
 *
 * IMPORTANT: this is the single source of truth for which table a guest
 * is ordering from. Never trust table numbers in the request body.
 */
export async function resolveTableByToken(token: string): Promise<
  | {
      tokenId: string;
      token: string;
      table: { id: string; label: string; slug: string; zone: string | null };
    }
  | null
> {
  const record = await prisma.tableQrToken.findUnique({
    where: { token },
    include: { table: true },
  });
  if (!record || !record.active || !record.table.active) return null;

  // Touch lastUsedAt (best-effort, fire-and-forget)
  prisma.tableQrToken
    .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return {
    tokenId: record.id,
    token: record.token,
    table: {
      id: record.table.id,
      label: record.table.label,
      slug: record.table.slug,
      zone: record.table.zone,
    },
  };
}