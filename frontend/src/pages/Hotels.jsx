import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { hotels } from "../data/hotels";
import { destinations, getDestination } from "../data/destinations";
import { PageHeader, Rating } from "../components/Shared";
import TicketCard from "../components/TicketCard";
import FavoriteButton from "../components/FavoriteButton";
import { MapPin, SlidersHorizontal } from "lucide-react";

const TYPES = ["All", "Luxury", "Resort", "Apartment", "Hostel", "Villa", "Budget Hotel"];

export default function Hotels() {
  const [params] = useSearchParams();
  const destFilter = params.get("destination") || "All";
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("rating");
  const [maxPrice, setMaxPrice] = useState(500);

  const filtered = useMemo(() => {
    let list = hotels.filter((h) => (destFilter === "All" ? true : h.destinationId === destFilter));
    if (type !== "All") list = list.filter((h) => h.type === type);
    list = list.filter((h) => h.pricePerNightUSD <= maxPrice);
    list = [...list].sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : a.pricePerNightUSD - b.pricePerNightUSD
    );
    return list;
  }, [destFilter, type, sort, maxPrice]);

  return (
    <div>
      <PageHeader
        eyebrow="Stay"
        title="Hotels, resorts, and everything between"
        subtitle="Filter by style and budget — live pricing shown per night in USD."
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="ticket p-5 mb-8 flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2 text-paper/60 text-sm shrink-0">
            <SlidersHorizontal size={15} className="text-brass" /> Filters
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none"
          >
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none"
          >
            <option value="rating">Top rated</option>
            <option value="price">Lowest price</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-paper/60">
            Up to ${maxPrice}/night
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-brass"
            />
          </label>
          {destFilter !== "All" && (
            <span className="text-xs font-mono text-brass border border-brass/30 rounded-full px-3 py-1">
              {getDestination(destFilter)?.name}
            </span>
          )}
        </div>

        <p className="text-sm text-paper/50 mb-6">{filtered.length} stays found</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h) => {
            const dest = getDestination(h.destinationId);
            return (
              <TicketCard key={h.id} notch={false} className="overflow-hidden relative group">
                <FavoriteButton itemType="hotel" itemId={h.id} name={h.name} image={h.image} className="absolute top-3 right-3 z-10" />
                <Link to={`/hotels/${h.id}`}>
                  <div className="h-44 overflow-hidden">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brass font-mono">{h.type}</p>
                    <p className="font-display text-lg mt-0.5">{h.name}</p>
                    <p className="text-xs text-paper/50 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {dest?.name} · {h.distanceFromCenterKm} km from center
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Rating value={h.rating} count={h.reviewCount} />
                      <span className="text-brass font-mono text-sm">${h.pricePerNightUSD}/night</span>
                    </div>
                  </div>
                </Link>
              </TicketCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
