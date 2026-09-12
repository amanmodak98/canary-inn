"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Search,
  X,
  ShoppingBag,
  ArrowRight,
  ChefHat,
  Check,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatRupees, paiseFromRupees } from "@/lib/utils";

type Category = { id: string; slug: string; name: string; description: string | null };
type Item = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  pricePaise: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
};

type CartLine = { item: Item; quantity: number; notes?: string };

const TAX_BPS = 250;

export default function MenuShell({ initialToken }: { initialToken?: string }) {
  const router = useRouter();

  const [table, setTable] = useState<{ id: string; label: string } | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitDone, setSubmitDone] = useState<{ shortCode: string; id: string; table: string; total: number } | null>(
    null,
  );

  // 1. Resolve table from token on mount.
  useEffect(() => {
    if (!initialToken) {
      setTableError("No table token. Please scan the QR on your table.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/public/tables/${initialToken}`);
        const data = await res.json();
        if (!res.ok) {
          setTableError(data.error ?? "Could not identify your table");
          return;
        }
        setTable(data.table);
      } catch {
        setTableError("Network error");
      }
    })();
  }, [initialToken]);

  // 2. Load menu.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/public/menu", { cache: "no-store" });
        const data = await res.json();
        setCategories(data.categories ?? []);
        setItems(data.items ?? []);
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  // 3. Persist cart in sessionStorage so a refresh doesn't lose it.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ci_cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem("ci_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (!map.has(it.categoryId)) map.set(it.categoryId, []);
      map.get(it.categoryId)!.push(it);
    }
    return map;
  }, [items]);

  const filteredByCategory = useMemo(() => {
    if (!search.trim()) return itemsByCategory;
    const q = search.toLowerCase();
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (it.name.toLowerCase().includes(q) || (it.description ?? "").toLowerCase().includes(q)) {
        if (!map.has(it.categoryId)) map.set(it.categoryId, []);
        map.get(it.categoryId)!.push(it);
      }
    }
    return map;
  }, [items, itemsByCategory, search]);

  const cartCount = cart.reduce((acc, l) => acc + l.quantity, 0);
  const cartSubtotal = cart.reduce((acc, l) => acc + l.item.pricePaise * l.quantity, 0);
  const cartTax = Math.round((cartSubtotal * TAX_BPS) / 10000);
  const cartTotal = cartSubtotal + cartTax;

  function addToCart(it: Item) {
    if (!it.isAvailable) return;
    setCart((c) => {
      const i = c.findIndex((l) => l.item.id === it.id);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...c, { item: it, quantity: 1 }];
    });
  }
  function decFromCart(id: string) {
    setCart((c) =>
      c
        .map((l) => (l.item.id === id ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }
  function removeLine(id: string) {
    setCart((c) => c.filter((l) => l.item.id !== id));
  }
  function qtyOf(id: string) {
    return cart.find((l) => l.item.id === id)?.quantity ?? 0;
  }

  async function placeOrder() {
    if (!cart.length || !initialToken) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tableToken: initialToken,
          notes: orderNotes || undefined,
          items: cart.map((l) => ({
            menuItemId: l.item.id,
            quantity: l.quantity,
            notes: l.notes,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place order");
      setSubmitDone({
        shortCode: data.order.shortCode,
        id: data.order.id,
        table: data.order.tableLabel,
        total: data.order.totalPaise,
      });
      setCart([]);
      setCartOpen(false);
      setConfirmOpen(false);
      try { sessionStorage.removeItem("ci_cart"); } catch {}
    } catch (e: any) {
      setSubmitError(e.message ?? "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  // After success → go to order status page.
  if (submitDone) {
    router.push(`/order/${submitDone.id}`);
    return null;
  }

  if (tableError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory p-6 text-center">
        <div className="text-eyebrow uppercase tracking-widest text-ember mb-3">QR error</div>
        <h1 className="font-serif text-3xl text-coal">We can't find your table.</h1>
        <p className="mt-3 max-w-md text-coal/70">{tableError}</p>
        <Link href="/contact" className="btn-primary mt-6">Contact the hotel</Link>
      </div>
    );
  }
  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="animate-spin text-ember" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-32 lg:pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-ivory/95 backdrop-blur border-b border-coal/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-coal tracking-tightest">Canary Inn</span>
            <span className="hidden sm:inline text-eyebrow uppercase tracking-widest text-ash">Menu</span>
          </Link>
          <div className="flex items-center gap-2 bg-cream px-3 py-1.5 rounded-full">
            <MapPin size={14} className="text-ember" />
            <span className="text-sm font-medium">{table.label}</span>
          </div>
        </div>

        {/* Heading + search */}
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="eyebrow text-ash">Order from your table</div>
          <h1 className="font-serif text-3xl text-coal mt-1">What would you like to order?</h1>
          <div className="relative mt-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full pl-10 pr-3 py-3 bg-cream rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="border-t border-coal/5">
          <div className="max-w-3xl mx-auto px-2 py-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max px-2">
              {categories.map((c) => {
                const count = (filteredByCategory.get(c.id) ?? []).length;
                if (search && count === 0) return null;
                const active = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.id);
                      const el = document.getElementById(`cat-${c.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      active ? "bg-coal text-ivory" : "bg-cream text-coal hover:bg-sand",
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Menu list */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        {loadingMenu ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-ember" size={28} />
          </div>
        ) : (
          categories.map((c) => {
            const list = filteredByCategory.get(c.id) ?? [];
            if (list.length === 0) return null;
            return (
              <section id={`cat-${c.id}`} key={c.id} className="py-6">
                <h2 className="font-serif text-2xl text-coal">{c.name}</h2>
                {c.description && <p className="mt-1 text-sm text-coal/60">{c.description}</p>}
                <div className="mt-5 space-y-3">
                  {list.map((it) => (
                    <MenuRow
                      key={it.id}
                      item={it}
                      qty={qtyOf(it.id)}
                      onAdd={() => addToCart(it)}
                      onDec={() => decFromCart(it.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Sticky cart button (mobile-first) */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4"
        >
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-3xl mx-auto bg-coal text-ivory px-5 py-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-coal/20 hover:bg-espresso transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="bg-ember text-ivory w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-medium">
                {cartCount}
              </span>
              <span className="font-medium">View Cart</span>
            </div>
            <div className="font-serif text-lg">{formatRupees(cartTotal)}</div>
          </button>
        </motion.div>
      )}

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-40 bg-coal/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 bg-ivory rounded-t-3xl max-h-[85vh] flex flex-col"
            >
              <div className="px-5 py-4 border-b border-coal/10 flex items-center justify-between">
                <div>
                  <div className="eyebrow">Your cart</div>
                  <div className="font-serif text-2xl text-coal">{cartCount} item{cartCount === 1 ? "" : "s"}</div>
                </div>
                <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="p-2 -mr-2">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-coal/60">
                    <ShoppingBag size={32} className="mx-auto mb-3 text-ash" />
                    Cart is empty.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {cart.map((l) => (
                      <li key={l.item.id} className="flex items-start gap-3 py-2 border-b border-coal/5">
                        {l.item.imageUrl ? (
                          <div className="relative w-14 h-14 shrink-0 bg-cream overflow-hidden rounded-lg">
                            <Image src={l.item.imageUrl} alt={l.item.name} fill sizes="56px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 shrink-0 bg-cream rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <VegBadge veg={l.item.isVeg} />
                                <h3 className="font-medium text-coal text-sm">{l.item.name}</h3>
                              </div>
                              <div className="text-xs text-coal/60 mt-1">
                                {formatRupees(l.item.pricePaise)} each
                              </div>
                            </div>
                            <button onClick={() => removeLine(l.item.id)} className="p-1 -mr-1 text-ash">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center bg-cream rounded-full">
                              <button
                                onClick={() => decFromCart(l.item.id)}
                                className="w-8 h-8 inline-flex items-center justify-center"
                                aria-label="Decrease"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm">{l.quantity}</span>
                              <button
                                onClick={() => addToCart(l.item)}
                                className="w-8 h-8 inline-flex items-center justify-center"
                                aria-label="Increase"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="font-medium text-sm">
                              {formatRupees(l.item.pricePaise * l.quantity)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-coal/10 px-5 py-4 space-y-3 bg-ivory">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-coal/70">
                      <span>Subtotal</span>
                      <span>{formatRupees(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-coal/70">
                      <span>Tax (2.5%)</span>
                      <span>{formatRupees(cartTax)}</span>
                    </div>
                    <div className="flex justify-between font-serif text-xl pt-2 border-t border-coal/10">
                      <span>Total</span>
                      <span>{formatRupees(cartTotal)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setConfirmOpen(true);
                    }}
                    className="btn-ember w-full justify-center !py-3"
                  >
                    Review & Place Order <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order confirmation sheet */}
      <AnimatePresence>
        {confirmOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setConfirmOpen(false)}
              className="fixed inset-0 z-40 bg-coal/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 bg-ivory rounded-t-3xl max-h-[90vh] flex flex-col"
            >
              <div className="px-5 py-4 border-b border-coal/10 flex items-center justify-between">
                <div className="font-serif text-2xl text-coal">Order Summary</div>
                <button
                  onClick={() => !submitting && setConfirmOpen(false)}
                  aria-label="Close"
                  className="p-2 -mr-2"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="flex items-center gap-2 text-eyebrow uppercase tracking-widest text-ash">
                  <MapPin size={14} className="text-ember" />
                  {table.label}
                </div>

                <ul className="mt-4 space-y-2">
                  {cart.map((l) => (
                    <li
                      key={l.item.id}
                      className="flex items-center justify-between py-2 border-b border-coal/5 text-sm"
                    >
                      <span>
                        {l.quantity} × {l.item.name}
                      </span>
                      <span className="font-medium">{formatRupees(l.item.pricePaise * l.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between text-coal/70">
                    <span>Subtotal</span>
                    <span>{formatRupees(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-coal/70">
                    <span>Tax (2.5%)</span>
                    <span>{formatRupees(cartTax)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl pt-2 border-t border-coal/10">
                    <span>Total</span>
                    <span>{formatRupees(cartTotal)}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="eyebrow block mb-2">Notes for the kitchen (optional)</label>
                  <textarea
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Allergies, spice level, etc."
                    className="w-full bg-cream rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ember/40 resize-none"
                  />
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-ember/10 text-ember text-sm rounded-lg">
                    {submitError}
                  </div>
                )}
              </div>
              <div className="border-t border-coal/10 px-5 py-4 bg-ivory">
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="btn-ember w-full justify-center !py-3 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Placing order…
                    </>
                  ) : (
                    <>
                      Place Order · {formatRupees(cartTotal)}
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-eyebrow uppercase tracking-widest text-ash">
                  Pay at the table · No card required
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({
  item,
  qty,
  onAdd,
  onDec,
}: {
  item: Item;
  qty: number;
  onAdd: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-coal/5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <VegBadge veg={item.isVeg} />
          <h3 className="font-medium text-coal">{item.name}</h3>
        </div>
        {item.description && (
          <p className="mt-1 text-xs text-coal/65 leading-relaxed line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <div className="font-serif text-base">{formatRupees(item.pricePaise)}</div>
          {!item.isAvailable && (
            <span className="text-eyebrow uppercase tracking-widest text-ember">Currently unavailable</span>
          )}
        </div>
      </div>
      <div className="relative w-24 h-24 shrink-0">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover rounded-lg" />
        )}
        {item.isAvailable && (
          <div className="absolute -bottom-2 -right-2">
            {qty === 0 ? (
              <button
                onClick={onAdd}
                className="w-9 h-9 rounded-full bg-coal text-ivory inline-flex items-center justify-center shadow-md hover:bg-ember transition-colors"
                aria-label={`Add ${item.name}`}
              >
                <Plus size={16} />
              </button>
            ) : (
              <div className="flex items-center bg-ivory rounded-full shadow-md border border-coal/10">
                <button
                  onClick={onDec}
                  className="w-8 h-8 inline-flex items-center justify-center"
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={onAdd}
                  className="w-8 h-8 inline-flex items-center justify-center"
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VegBadge({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-3.5 h-3.5 border-2 flex items-center justify-center shrink-0",
        veg ? "border-leaf" : "border-ember",
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", veg ? "bg-leaf" : "bg-ember")} />
    </span>
  );
}