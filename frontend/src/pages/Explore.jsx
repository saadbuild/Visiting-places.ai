import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { destinations } from "../data/destinations";
import { PageHeader } from "../components/Shared";
import TicketCard from "../components/TicketCard";
import FavoriteButton from "../components/FavoriteButton";
import { X } from "lucide-react";

const CONTINENTS = ["All", ...new Set(destinations.map((d) => d.continent))];
const ALL_TAGS = [...new Set(destinations.flatMap((d) => d.tags))].sort();

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [continent, setContinent] = useState("All");
  const [activeTags, setActiveTags] = useState([]);
  const q = params.get("q") || "";

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.country.toLowerCase().includes(q.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      const matchesContinent = continent === "All" || d.continent === continent;
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => d.tags.includes(t));
      return matchesQuery && matchesContinent && matchesTags;
    });
  }, [q, continent, activeTags]);

  function toggleTag(tag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Every place, one filter away"
        subtitle="Search by name, or narrow by continent and interest to find where you'd actually want to spend a week."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        {q && (
          <div className="flex items-center gap-2 mb-6 text-sm text-paper/60">
            Showing results for <span className="text-brass">"{q}"</span>
            <button onClick={() => setParams({})} className="text-paper/40 hover:text-coral">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                continent === c ? "bg-brass text-ink-800 border-brass" : "border-paper/15 text-paper/70 hover:border-brass/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors font-mono ${
                activeTags.includes(tag) ? "bg-coral/20 border-coral text-coral-light" : "border-paper/10 text-paper/50 hover:border-paper/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-paper/50 py-16 text-center">No destinations match those filters yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <TicketCard key={d.id} notch={false} className="overflow-hidden group relative">
                <FavoriteButton
                  itemType="destination"
                  itemId={d.id}
                  name={d.name}
                  image={d.thumb}
                  className="absolute top-3 right-3 z-10"
                />
                <Link to={`/destination/${d.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={d.thumb} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="font-display text-xl">{d.name}</p>
                      <p className="text-xs text-paper/60">{d.country} · {d.continent}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-paper/60 leading-relaxed line-clamp-2">{d.blurb}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {d.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[11px] font-mono text-brass/80 border border-brass/30 rounded-full px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </TicketCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
