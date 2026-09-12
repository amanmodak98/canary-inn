// 7-day order retention.
//
// Behavior:
//   - Hard-deletes Order + OrderItem rows whose createdAt is older than the
//     retention window. Database-side timestamps are used; client timestamps
//     are never trusted.
//   - Also purges ContactMessage rows older than the retention window.
//   - Idempotent and safe to call from a cron endpoint daily.
//
// The retention period defaults to 7 days but is configurable so the
// system can be tuned without code changes.

import { prisma } from "./prisma";

export const DEFAULT_RETENTION_DAYS = 7;

export type PurgeResult = {
  retentionDays: number;
  ordersDeleted: number;
  contactMessagesDeleted: number;
  cutoff: Date;
};

export async function purgeOldOrders(retentionDays: number = DEFAULT_RETENTION_DAYS): Promise<PurgeResult> {
  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    throw new Error("retentionDays must be a positive number");
  }
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  // OrderItem rows are removed by onDelete: Cascade; ContactMessage is independent.
  const result = await prisma.$transaction(async (tx) => {
    const orders = await tx.order.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    const msgs = await tx.contactMessage.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return { ordersDeleted: orders.count, contactMessagesDeleted: msgs.count };
  });

  // Operational log only — never logs guest data.
  console.info(
    `[retention] purged ${result.ordersDeleted} orders and ${result.contactMessagesDeleted} contact messages older than ${retentionDays} day(s) (cutoff=${cutoff.toISOString()})`,
  );

  return { retentionDays, cutoff, ...result };
}