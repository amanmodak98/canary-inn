"use client";

import { useMemo, useState } from "react";
import { Plus, X, Save, Power, EyeOff, Eye } from "lucide-react";
import { formatRupees, formatRupeesPlain, paiseFromRupees } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };
type Item = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  pricePaise: number;
  isVeg: boolean;
  isAvailable: boolean;
  active: boolean;
  imageUrl: string | null;
};

export default function MenuManager({
  initial,
}: {
  initial: { categories: Category[]; items: Item[] };
}) {
  const [categories] = useState<Category[]>(initial.categories);
  const [items, setItems] = useState<Item[]>(initial.items);
  const [adding, setAdding] = useState(false);
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.id ?? "");

  async function patch(id: string, data: Partial<Item>) {
    const res = await fetch(`/api/admin/menu/items/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...data } : it)));
    }
  }

  const visible = useMemo(
    () => items.filter((it) => it.categoryId === activeCat),
    [items, activeCat],
  );

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3">
        <div className="bg-ivory border border-coal/10 p-3">
          <div className="px-2 py-2 eyebrow text-ash">Categories</div>
          <ul className="mt-2 space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveCat(c.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    activeCat === c.id ? "bg-coal text-ivory" : "hover:bg-cream"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary mt-4 w-full justify-center">
          <Plus size={14} /> Add item
        </button>
      </aside>

      <div className="lg:col-span-9">
        <div className="bg-ivory border border-coal/10">
          <table className="w-full text-sm">
            <thead className="bg-cream text-eyebrow uppercase tracking-widest text-ash">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Veg</th>
                <th className="text-left px-4 py-3">Availability</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal/5">
              {visible.map((it) => (
                <Row key={it.id} item={it} onPatch={patch} />
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-coal/55">
                    No items in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {adding && (
        <AddItemModal
          categories={categories}
          defaultCategoryId={activeCat}
          onClose={() => setAdding(false)}
          onCreated={(created) => {
            setItems((prev) => [...prev, created]);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

function Row({ item, onPatch }: { item: Item; onPatch: (id: string, d: Partial<Item>) => void }) {
  const [editing, setEditing] = useState(false);
  const [priceStr, setPriceStr] = useState(String(item.pricePaise / 100));
  const [name, setName] = useState(item.name);
  const [desc, setDesc] = useState(item.description ?? "");

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="font-medium">{item.name}</div>
        {item.description && <div className="text-coal/55 text-xs mt-0.5">{item.description}</div>}
      </td>
      <td className="px-4 py-3 font-serif">{formatRupees(item.pricePaise)}</td>
      <td className="px-4 py-3">
        <span className={`text-eyebrow uppercase tracking-widest ${item.isVeg ? "text-leaf" : "text-ember"}`}>
          {item.isVeg ? "Veg" : "Non-veg"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-eyebrow uppercase tracking-widest ${
            item.isAvailable ? "text-leaf" : "text-ember"
          }`}
        >
          {item.isAvailable ? "Available" : "Hidden"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onPatch(item.id, { isAvailable: !item.isAvailable })}
            className="p-2 text-coal/60 hover:text-coal"
            title={item.isAvailable ? "Hide" : "Show"}
          >
            {item.isAvailable ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-eyebrow uppercase tracking-widest px-3 py-1 border border-coal/20 hover:bg-coal hover:text-ivory"
          >
            Edit
          </button>
        </div>
      </td>
      {editing && (
        <td colSpan={5} className="bg-cream/40 px-4 py-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="eyebrow block mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-ivory px-3 py-2 rounded text-sm" />
            </div>
            <div>
              <label className="eyebrow block mb-1">Price (₹)</label>
              <input
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                type="number"
                step="1"
                className="w-full bg-ivory px-3 py-2 rounded text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={async () => {
                  await onPatch(item.id, {
                    name,
                    description: desc || null,
                    pricePaise: paiseFromRupees(Number(priceStr) || 0),
                  });
                  setEditing(false);
                }}
                className="btn-ember !py-2 !px-4"
              >
                <Save size={14} /> Save
              </button>
              <button onClick={() => setEditing(false)} className="px-3 py-2 text-sm text-coal/60 hover:text-coal">
                Cancel
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="eyebrow block mb-1">Description</label>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-ivory px-3 py-2 rounded text-sm resize-none"
              />
            </div>
          </div>
        </td>
      )}
    </tr>
  );
}

function AddItemModal({
  categories,
  defaultCategoryId,
  onClose,
  onCreated,
}: {
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onCreated: (item: Item) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/menu/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          categoryId,
          name,
          description: desc || null,
          pricePaise: paiseFromRupees(Number(price) || 0),
          imageUrl: imageUrl || null,
          isVeg,
          isAvailable: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add");
        return;
      }
      onCreated({
        id: data.item.id,
        categoryId: data.item.categoryId,
        name: data.item.name,
        description: data.item.description,
        pricePaise: data.item.pricePaise,
        isVeg: data.item.isVeg,
        isAvailable: data.item.isAvailable,
        active: data.item.active,
        imageUrl: data.item.imageUrl,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-coal/40 flex items-center justify-center p-4">
      <div className="bg-ivory w-full max-w-lg p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-coal">Add menu item</h3>
          <button onClick={onClose} className="p-2 -mr-2"><X size={18} /></button>
        </div>
        <div className="mt-5 space-y-3">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-cream px-3 py-2 rounded text-sm" />
          </Field>
          <Field label="Category">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-cream px-3 py-2 rounded text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)">
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full bg-cream px-3 py-2 rounded text-sm" />
            </Field>
            <Field label="Type">
              <select value={isVeg ? "veg" : "nonveg"} onChange={(e) => setIsVeg(e.target.value === "veg")} className="w-full bg-cream px-3 py-2 rounded text-sm">
                <option value="veg">Veg</option>
                <option value="nonveg">Non-veg</option>
              </select>
            </Field>
          </div>
          <Field label="Image URL (optional)">
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-cream px-3 py-2 rounded text-sm" placeholder="https://…" />
          </Field>
          <Field label="Description">
            <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-cream px-3 py-2 rounded text-sm resize-none" />
          </Field>
          {error && <div className="text-sm text-ember">{error}</div>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-coal/60 hover:text-coal">Cancel</button>
          <button onClick={save} disabled={saving || !name || !price} className="btn-ember disabled:opacity-60">
            {saving ? "Saving…" : "Add item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-1">{label}</label>
      {children}
    </div>
  );
}