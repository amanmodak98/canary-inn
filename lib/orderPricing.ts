// Server-side order pricing. NEVER trust client totals.

import { prisma } from "./prisma";

export const TAX_BPS = 250; // 2.5% GST — matches typical Indian restaurant practice.

export type OrderLineInput = { menuItemId: string; quantity: number; notes?: string };

export type OrderLinePriced = {
  menuItemId: string;
  nameSnapshot: string;
  unitPricePaise: number;
  quantity: number;
  notes?: string;
};

export type OrderTotals = {
  lines: OrderLinePriced[];
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
};

/**
 * Recomputes an order against current DB prices and availability.
 * Throws an Error if any item is unknown or unavailable.
 */
export async function priceOrder(input: OrderLineInput[]): Promise<OrderTotals> {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  // Deduplicate + sum quantities per item id.
  const merged = new Map<string, { quantity: number; notes?: string }>();
  for (const line of input) {
    if (!line || typeof line.menuItemId !== "string" || typeof line.quantity !== "number") {
      throw new Error("Invalid order line");
    }
    if (line.quantity <= 0 || line.quantity > 50) {
      throw new Error("Invalid quantity");
    }
    const existing = merged.get(line.menuItemId);
    if (existing) {
      existing.quantity += line.quantity;
      if (line.notes) existing.notes = line.notes;
    } else {
      merged.set(line.menuItemId, { quantity: line.quantity, notes: line.notes });
    }
  }

  const ids = [...merged.keys()];
  const items = await prisma.menuItem.findMany({
    where: { id: { in: ids } },
  });
  const byId = new Map(items.map((i) => [i.id, i]));

  const lines: OrderLinePriced[] = [];
  let subtotalPaise = 0;
  for (const [id, { quantity, notes }] of merged) {
    const item = byId.get(id);
    if (!item) throw new Error(`Unknown menu item: ${id}`);
    if (!item.isAvailable || !item.active) {
      throw new Error(`Item unavailable: ${item.name}`);
    }
    const line: OrderLinePriced = {
      menuItemId: id,
      nameSnapshot: item.name,
      unitPricePaise: item.pricePaise,
      quantity,
      notes,
    };
    lines.push(line);
    subtotalPaise += item.pricePaise * quantity;
  }

  // Tax is rounded half-up to nearest rupee (paise) on the subtotal.
  const taxPaise = Math.round((subtotalPaise * TAX_BPS) / 10000);
  const totalPaise = subtotalPaise + taxPaise;

  return { lines, subtotalPaise, taxPaise, totalPaise };
}

export function generateShortCode(): string {
  // 4-digit CI-#### short code. Collisions extremely unlikely; we still
  // surface the Prisma unique-violation and retry up to 3 times.
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CI-${n}`;
}