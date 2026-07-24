import { useMemo, useState } from "react";
import { foods } from "../data/foods";
import { destinations, getDestination } from "../data/destinations";
import { PageHeader, Rating } from "../components/Shared";

const TYPES = ["All", "Traditional", "Street Food", "Dessert", "Drink"];

export default function Foods() {
  const [destId, setDestId] = useState("All");
  const [type, setType] = useState("All");

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      const d = destId === "All" || f.destinationId === destId;
      const t = type === "All" || f.type === type;
      return d && t;
    });
  }, [destId, type]);

  return (
    <div>
      <PageHeader
        eyebrow="Taste"
        title="The dishes that define a place"
        subtitle="Traditional plates, street food, desserts, and drinks — with what they typically cost."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="ticket p-5 mb-8 flex flex-wrap gap-4">
          <select value={destId} onChange={(e) => setDestId(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            <option value="All">All destinations</option>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((f) => (
            <div key={f.id} className="ticket overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[11px] text-brass font-mono uppercase">{f.type}</p>
                <p className="font-medium text-sm mt-1">{f.name}</p>
                <p className="text-xs text-paper/45 mt-1">{getDestination(f.destinationId)?.name}</p>
                <p className="text-xs text-paper/55 mt-2 leading-relaxed line-clamp-2">{f.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <Rating value={f.rating} size={12} />
                  <span className="text-brass font-mono text-xs">~${f.avgPriceUSD}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
