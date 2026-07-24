import { useParams, Link, Navigate } from "react-router-dom";
import { getDestination } from "../data/destinations";
import { hotelsFor } from "../data/hotels";
import { restaurantsFor } from "../data/restaurants";
import { foodsFor } from "../data/foods";
import { attractionsFor } from "../data/attractions";
import TicketCard from "../components/TicketCard";
import FavoriteButton from "../components/FavoriteButton";
import { Rating } from "../components/Shared";
import MapView from "../components/MapView";
import { ArrowRight, MapPin, Languages, Clock, CalendarRange } from "lucide-react";

function Section({ title, to, children }) {
  return (
    <section className="py-10 border-t border-paper/10">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        {to && (
          <Link to={to} className="text-sm text-brass flex items-center gap-1 hover:gap-2 transition-all shrink-0">
            See all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default function DestinationDetail() {
  const { id } = useParams();
  const dest = getDestination(id);
  if (!dest) return <Navigate to="/explore" replace />;

  const hotels = hotelsFor(id).slice(0, 3);
  const restaurants = restaurantsFor(id).slice(0, 3);
  const foods = foodsFor(id).slice(0, 4);
  const attractions = attractionsFor(id).slice(0, 3);

  return (
    <div>
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-5 sm:px-8 pb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brass font-mono mb-2">{dest.continent}</p>
            <h1 className="font-display text-5xl sm:text-6xl">{dest.name}</h1>
            <p className="text-paper/70 mt-2">{dest.country}</p>
          </div>
          <FavoriteButton itemType="destination" itemId={dest.id} name={dest.name} image={dest.thumb} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid md:grid-cols-3 gap-6 -mt-6 relative z-10">
          <TicketCard className="p-5 bg-ink-700">
            <MapPin size={16} className="text-brass mb-2" />
            <p className="text-xs text-paper/50">Best time to visit</p>
            <p className="text-sm mt-1">{dest.bestSeason}</p>
          </TicketCard>
          <TicketCard className="p-5 bg-ink-700">
            <Languages size={16} className="text-brass mb-2" />
            <p className="text-xs text-paper/50">Language & currency</p>
            <p className="text-sm mt-1">{dest.language} · {dest.currency}</p>
          </TicketCard>
          <TicketCard className="p-5 bg-ink-700">
            <Clock size={16} className="text-brass mb-2" />
            <p className="text-xs text-paper/50">Time zone</p>
            <p className="text-sm mt-1">{dest.timezone}</p>
          </TicketCard>
        </div>

        <div className="py-12 max-w-3xl">
          <p className="text-paper/70 leading-relaxed text-lg">{dest.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {dest.tags.map((t) => (
              <span key={t} className="text-xs font-mono text-brass/80 border border-brass/30 rounded-full px-3 py-1">
                {t}
              </span>
            ))}
          </div>
          <Link
            to={`/trip-planner?destination=${dest.id}`}
            className="inline-flex items-center gap-2 mt-8 bg-brass text-ink-800 font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors"
          >
            <CalendarRange size={16} /> Plan a trip to {dest.name}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 pb-10">
          {dest.gallery.map((g, i) => (
            <img key={i} src={g} alt="" className="rounded-stub h-40 sm:h-56 w-full object-cover" />
          ))}
        </div>

        <Section title="Where to stay" to={`/hotels?destination=${dest.id}`}>
          <div className="grid sm:grid-cols-3 gap-5">
            {hotels.map((h) => (
              <Link key={h.id} to={`/hotels/${h.id}`} className="ticket overflow-hidden group">
                <div className="relative h-36 overflow-hidden">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{h.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Rating value={h.rating} count={h.reviewCount} />
                    <span className="text-brass text-sm font-mono">${h.pricePerNightUSD}/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Where to eat" to={`/restaurants?destination=${dest.id}`}>
          <div className="grid sm:grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <div key={r.id} className="ticket overflow-hidden">
                <div className="h-32 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-paper/50 mt-1">{r.cuisine} · {r.priceRange}</p>
                  <Rating value={r.rating} count={r.reviewCount} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Famous local foods" to="/foods">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {foods.map((f) => (
              <div key={f.id} className="ticket overflow-hidden">
                <div className="h-24 overflow-hidden">
                  <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-xs">{f.name}</p>
                  <p className="text-brass text-xs font-mono mt-1">~${f.avgPriceUSD}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Top attractions" to="/attractions">
          <div className="grid sm:grid-cols-3 gap-5">
            {attractions.map((a) => (
              <div key={a.id} className="ticket overflow-hidden">
                <div className="h-32 overflow-hidden">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-paper/50 mt-1">{a.category} · {a.entryFeeUSD === 0 ? "Free" : `$${a.entryFeeUSD}`}</p>
                  <Rating value={a.rating} count={a.reviewCount} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Map">
          <MapView center={[dest.lat, dest.lon]} zoom={12} markers={[{ lat: dest.lat, lon: dest.lon, name: dest.name }]} />
        </Section>
      </div>
    </div>
  );
}
