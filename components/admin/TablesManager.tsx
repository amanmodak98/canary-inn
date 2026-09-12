"use client";

import { useState } from "react";
import { Plus, Download, RotateCw, Power, QrCode } from "lucide-react";

type Table = {
  id: string;
  label: string;
  slug: string;
  zone: string | null;
  active: boolean;
  token: string | null;
};

export default function TablesManager({ initial }: { initial: Table[] }) {
  const [tables, setTables] = useState<Table[]>(initial);
  const [creating, setCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [zone, setZone] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (!label) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ label, zone: zone || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add table");
        return;
      }
      setTables((t) => [...t, { id: data.table.id, label: data.table.label, slug: data.table.slug, zone: data.table.zone, active: true, token: null }]);
      // Fetch the new token by re-listing
      const list = await fetch("/api/admin/tables", { cache: "no-store" });
      const listData = await list.json();
      setTables((listData.tables ?? []).map((x: any) => ({
        id: x.id,
        label: x.label,
        slug: x.slug,
        zone: x.zone,
        active: x.active,
        token: (x.qrTokens ?? [])[0]?.token ?? null,
      })));
      setLabel("");
      setZone("");
    } finally {
      setCreating(false);
    }
  }

  async function regenerate(id: string) {
    const res = await fetch(`/api/admin/tables/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regenerateToken: true }),
    });
    const data = await res.json();
    if (res.ok) {
      // Reload
      const list = await fetch("/api/admin/tables", { cache: "no-store" });
      const listData = await list.json();
      setTables((listData.tables ?? []).map((x: any) => ({
        id: x.id,
        label: x.label,
        slug: x.slug,
        zone: x.zone,
        active: x.active,
        token: (x.qrTokens ?? [])[0]?.token ?? null,
      })));
    }
  }

  async function toggleActive(t: Table) {
    const res = await fetch(`/api/admin/tables/${t.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !t.active }),
    });
    if (res.ok) setTables((prev) => prev.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)));
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <div className="bg-ivory border border-coal/10 p-6">
          <div className="eyebrow">Add table</div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="eyebrow block mb-2">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Table 13"
                className="w-full bg-cream px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">Zone (optional)</label>
              <input
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="Indoor / Garden / Lounge"
                className="w-full bg-cream px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>
            {error && <div className="text-sm text-ember">{error}</div>}
            <button onClick={add} disabled={creating || !label} className="btn-primary disabled:opacity-60">
              <Plus size={14} /> {creating ? "Adding…" : "Add table"}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
        {tables.map((t) => (
          <article key={t.id} className={`bg-ivory border p-5 ${t.active ? "border-coal/10" : "border-coal/5 opacity-60"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-serif text-xl">{t.label}</div>
                <div className="text-eyebrow uppercase tracking-widest text-ash mt-0.5">
                  {t.zone ?? "—"}
                </div>
              </div>
              <div className="text-eyebrow uppercase tracking-widest text-ash">
                {t.active ? "Active" : "Disabled"}
              </div>
            </div>

            <div className="mt-5 bg-cream p-4">
              {t.token ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/qr/${t.token}`}
                    alt={`QR for ${t.label}`}
                    className="w-32 h-32 mx-auto"
                  />
                  <div className="mt-3 text-center text-eyebrow uppercase tracking-widest text-ash break-all">
                    Token: {t.token.slice(0, 8)}…
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={`/api/qr/${t.token}?size=1200`}
                      download={`canary-${t.slug}.png`}
                      className="flex items-center justify-center gap-1.5 bg-coal text-ivory py-2 text-xs uppercase tracking-widest hover:bg-ember"
                    >
                      <Download size={12} /> PNG
                    </a>
                    <button
                      onClick={() => regenerate(t.id)}
                      className="flex items-center justify-center gap-1.5 border border-coal/20 py-2 text-xs uppercase tracking-widest hover:bg-coal hover:text-ivory"
                    >
                      <RotateCw size={12} /> Regenerate
                    </button>
                    <button
                      onClick={() => toggleActive(t)}
                      className={`flex items-center justify-center gap-1.5 border py-2 text-xs uppercase tracking-widest ${
                        t.active
                          ? "border-ember/40 text-ember hover:bg-ember hover:text-ivory"
                          : "border-coal/20 hover:bg-coal hover:text-ivory"
                      }`}
                    >
                      <Power size={12} /> {t.active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-coal/55 py-6 text-sm">
                  <QrCode size={20} className="mx-auto mb-2" />
                  No active token.
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}