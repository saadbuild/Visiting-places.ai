import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { getDestination } from "../data/destinations";
import { PageHeader, Rating } from "../components/Shared";
import TicketCard from "../components/TicketCard";
import { Clock, MapPin } from "lucide-react";

const CUISINES = ["All", ...new Set(restaurants.map((r) => r.cuisine))];
const PRICE_RANGES = ["All", "$", "$$", "$$$", "$$$$"];

export default function Restaurants() {
  const [params] = useSearchParams();
  const destFilter = params.get("destination") || "All";
  const [cuisine, setCuisine] = useState("All");
  const [price, setPrice] = useState("All");

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const d = destFilter === "All" || r.destinationId === destFilter;
      const c = cuisine === "All" || r.cuisine === cuisine;
      const p = price === "All" || r.priceRange === price;
      return d && c && p;
    });
  }, [destFilter, cuisine, price]);

  return (
    <div>
      <PageHeader
        eyebrow="Eat"
        title="Restaurants worth changing your plans for"
        subtitle="From street-cart classics to tasting menus, filtered by cuisine and price."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="ticket p-5 mb-8 flex flex-wrap gap-4">
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            {CUISINES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            {PRICE_RANGES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => {
            const dest = getDestination(r.destinationId);
            return (
              <TicketCard key={r.id} notch={false} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg">{r.name}</p>
                    <span className="text-brass font-mono text-sm">{r.priceRange}</span>
                  </div>
                  <p className="text-xs text-paper/50 mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {dest?.name} · {r.cuisine}
                  </p>
                  <p className="text-xs text-paper/45 mt-2 flex items-center gap-1">
                    <Clock size={12} /> {r.openingHours}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.popularDishes.slice(0, 2).map((d) => (
                      <span key={d} className="text-[11px] font-mono text-brass/80 border border-brass/30 rounded-full px-2 py-0.5">{d}</span>
                    ))}
                  </div>
                  <div className="mt-3"><Rating value={r.rating} count={r.reviewCount} /></div>
                </div>
              </TicketCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
