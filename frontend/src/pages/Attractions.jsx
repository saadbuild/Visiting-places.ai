import { useMemo, useState } from "react";
import { attractions } from "../data/attractions";
import { destinations, getDestination } from "../data/destinations";
import { PageHeader, Rating } from "../components/Shared";
import { Clock, Users, Ticket } from "lucide-react";

const CATEGORIES = ["All", ...new Set(attractions.map((a) => a.category))];

export default function Attractions() {
  const [destId, setDestId] = useState("All");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return attractions.filter((a) => {
      const d = destId === "All" || a.destinationId === destId;
      const c = category === "All" || a.category === category;
      return d && c;
    });
  }, [destId, category]);

  return (
    <div>
      <PageHeader
        eyebrow="See"
        title="Landmarks, museums, and quiet corners"
        subtitle="Entry fees, crowd levels, and the best time of day to show up."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="ticket p-5 mb-8 flex flex-wrap gap-4">
          <select value={destId} onChange={(e) => setDestId(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            <option value="All">All destinations</option>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <div key={a.id} className="ticket overflow-hidden">
              <div className="h-44 overflow-hidden">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[11px] text-brass font-mono uppercase">{a.category} · {getDestination(a.destinationId)?.name}</p>
                <p className="font-display text-lg mt-1">{a.name}</p>
                <p className="text-sm text-paper/55 mt-2 leading-relaxed line-clamp-2">{a.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-paper/55">
                  <span className="flex items-center gap-1"><Ticket size={13} className="text-brass" /> {a.entryFeeUSD === 0 ? "Free entry" : `$${a.entryFeeUSD}`}</span>
                  <span className="flex items-center gap-1"><Clock size={13} className="text-brass" /> {a.visitDurationHrs}h visit</span>
                  <span className="flex items-center gap-1"><Users size={13} className="text-brass" /> {a.crowdLevel} crowds</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Rating value={a.rating} count={a.reviewCount} size={12} />
                  <span className="text-xs text-paper/45">Best: {a.bestTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
