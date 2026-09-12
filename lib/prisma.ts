// Lazy Prisma client singleton.
//
// The client is only instantiated on first property access — so just
// importing this module never tries to connect to the database. This is
// what lets the public-facing Vercel deploy succeed without DATABASE_URL
// (and lets admin routes like /admin/logout build even when the DB isn't
// reachable). Any actual query will still fail until DATABASE_URL is set,
// which is the correct behaviour.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Lazy proxy that constructs the PrismaClient on first use. All property
 * access is forwarded to the underlying instance. Bind methods so they
 * retain `this` when destructured (`const { findUnique } = prisma.x`).
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrisma();
    }
    const value = globalForPrisma.prisma[prop as keyof PrismaClient];
    return typeof value === "function" ? value.bind(globalForPrisma.prisma) : value;
  },
});

if (process.env.NODE_ENV !== "production") {
  // Eager assignment in dev so HMR keeps the same instance.
  (globalForPrisma as any).prisma = globalForPrisma.prisma;
}