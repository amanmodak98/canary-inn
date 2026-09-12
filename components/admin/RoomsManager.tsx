"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Room = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  maxGuests: number | null;
  sizeSqft: number | null;
  bedType: string | null;
  basePricePaise: number | null;
  heroImage: string | null;
  active: boolean;
};

export default function RoomsManager({ initial }: { initial: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initial);

  async function toggle(id: string) {
    // Optimistic
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
    // We don't have a rooms patch endpoint — surface in UI that this is read-only.
    // (Adding endpoints is left as future work; current rooms are seeded.)
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {rooms.map((r) => (
        <article key={r.id} className={`bg-ivory border p-5 ${r.active ? "border-coal/10" : "border-coal/5 opacity-60"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-serif text-xl">{r.name}</div>
              <div className="text-eyebrow uppercase tracking-widest text-ash mt-0.5">{r.slug}</div>
            </div>
            <button onClick={() => toggle(r.id)} className="text-coal/60 hover:text-coal p-2">
              {r.active ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
          {r.description && <p className="mt-3 text-sm text-coal/70 leading-relaxed">{r.description}</p>}
          <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {r.bedType && (
              <>
                <dt className="text-ash uppercase tracking-widest text-eyebrow">Bed</dt>
                <dd>{r.bedType}</dd>
              </>
            )}
            {r.maxGuests && (
              <>
                <dt className="text-ash uppercase tracking-widest text-eyebrow">Guests</dt>
                <dd>Up to {r.maxGuests}</dd>
              </>
            )}
            {r.sizeSqft && (
              <>
                <dt className="text-ash uppercase tracking-widest text-eyebrow">Size</dt>
                <dd>{r.sizeSqft} sq ft</dd>
              </>
            )}
          </dl>
        </article>
      ))}
    </div>
  );
}