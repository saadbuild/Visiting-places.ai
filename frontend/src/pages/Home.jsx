import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Sparkles, Wallet, Fuel, CloudSun, MessageCircle, Map as MapIcon,
  Hotel, UtensilsCrossed, Landmark, ArrowRight, CalendarRange,
} from "lucide-react";
import { destinations } from "../data/destinations";
import StampBadge from "../components/StampBadge";
import TicketCard from "../components/TicketCard";
import { Rating } from "../components/Shared";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripsContext";
import { useApp } from "../context/AppContext";
import { formatMoney, formatDate } from "../lib/format";

const AI_FEATURES = [
  { icon: Sparkles, title: "AI trip planner", text: "A full day-by-day itinerary built from your dates, budget, and interests.", to: "/trip-planner" },
  { icon: Wallet, title: "Budget planner", text: "Flights, stays, food, and activities — one honest total before you book.", to: "/budget-planner" },
  { icon: Fuel, title: "Fuel calculator", text: "Real cost-per-mile for road trips, by vehicle and fuel type.", to: "/fuel-calculator" },
  { icon: CloudSun, title: "Live weather", text: "Real forecasts and packing suggestions for where you're headed.", to: "/weather" },
  { icon: MessageCircle, title: "AI travel assistant", text: "Ask anything — visas, safety, currency, what to pack.", to: "/assistant" },
  { icon: MapIcon, title: "Live map explorer", text: "Nearby hotels, hospitals, fuel stops, and transit, wherever you are.", to: "/map" },
];

const CATEGORIES = [
  { icon: Hotel, label: "Hotels", to: "/hotels" },
  { icon: UtensilsCrossed, label: "Restaurants", to: "/restaurants" },
  { icon: Landmark, label: "Attractions", to: "/attractions" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips } = useTrips();
  const { currency } = useApp();

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore");
  }

  const firstName = user?.name?.split(" ")[0];

  // Prefer a saved trip with a future start date; fall back to the most
  // recently saved one (trips are newest-first).
  const featuredTrip = (() => {
    if (!trips.length) return null;
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = trips
      .filter((t) => t.startDate && t.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    return upcoming[0] || trips[0];
  })();

  const nights = featuredTrip?.itinerary?.length || 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/vp-hero-main/1920/1080"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StampBadge>{user ? `${getGreeting()}, ${firstName}` : "Est. for wandering"}</StampBadge>

            {user ? (
              featuredTrip ? (
                <>
                  <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] mt-6 max-w-3xl">
                    Your <span className="italic text-brass">{featuredTrip.destination}</span> trip is taking shape.
                  </h1>
                  <p className="text-paper/65 text-lg mt-6 max-w-xl leading-relaxed">
                    {nights} night{nights === 1 ? "" : "s"} for {featuredTrip.travelers} traveler{featuredTrip.travelers === 1 ? "" : "s"}
                    {featuredTrip.startDate ? `, starting ${formatDate(featuredTrip.startDate)}` : ""}
                    {featuredTrip.budget ? ` — about ${formatMoney(featuredTrip.budget, currency)} altogether.` : "."}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 bg-brass text-ink-800 font-medium px-6 py-3 rounded-full hover:bg-brass-light transition-colors">
                      <CalendarRange size={16} /> View full itinerary
                    </Link>
                    <Link to="/trip-planner" className="inline-flex items-center gap-2 border border-paper/20 text-paper/80 font-medium px-6 py-3 rounded-full hover:border-brass/60 hover:text-brass transition-colors">
                      Plan another trip
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] mt-6 max-w-3xl">
                    Ready for your <span className="italic text-brass">next adventure</span>?
                  </h1>
                  <p className="text-paper/65 text-lg mt-6 max-w-xl leading-relaxed">
                    You haven't planned a trip yet — build your first AI itinerary in about ten seconds.
                  </p>
                  <div className="mt-10">
                    <Link to="/trip-planner" className="inline-flex items-center gap-2 bg-brass text-ink-800 font-medium px-6 py-3 rounded-full hover:bg-brass-light transition-colors">
                      <Sparkles size={16} /> Plan your first trip
                    </Link>
                  </div>
                </>
              )
            ) : (
              <>
                <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] mt-6 max-w-3xl">
                  Every trip, planned like a photograph —
                  <span className="italic text-brass"> composed</span>, not rushed.
                </h1>
                <p className="text-paper/65 text-lg mt-6 max-w-xl leading-relaxed">
                  Visiting Places uses live weather, real budgeting, and AI itineraries
                  to plan trips anywhere on earth — down to the last local dish.
                </p>
              </>
            )}

            <form onSubmit={handleSearch} className="mt-10 max-w-xl">
              <div className="ticket flex items-center gap-3 bg-ink-700/80 backdrop-blur px-5 py-3.5">
                <Search size={18} className="text-brass shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Where to? Try Tokyo, Bali, Rome…"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base placeholder:text-paper/40"
                />
                <button className="bg-brass text-ink-800 text-sm font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-brass-light transition-colors shrink-0">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-3 mt-6">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="flex items-center gap-2 text-sm text-paper/70 border border-paper/15 rounded-full px-4 py-2 hover:border-brass/60 hover:text-brass transition-colors"
                >
                  <c.icon size={15} /> {c.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brass font-mono mb-2">Featured</p>
            <h2 className="font-display text-3xl sm:text-4xl">Destinations worth the layover</h2>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center gap-1 text-sm text-brass hover:gap-2 transition-all">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link to={`/destination/${d.id}`}>
                <TicketCard notch={false} className="group overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    <img src={d.thumb} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p className="font-display text-xl">{d.name}</p>
                        <p className="text-xs text-paper/60">{d.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ticket-perforation" />
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-xs text-paper/55 font-mono">{d.bestSeason.split(",")[0]}</p>
                    <span className="text-xs text-brass">{d.tags[0]}</span>
                  </div>
                </TicketCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI features */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-brass font-mono mb-2">The toolkit</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-10 max-w-xl">
          Everything a trip needs, none of the tabs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_FEATURES.map((f) => (
            <Link to={f.to} key={f.title} className="ticket p-6 hover:border-brass/50 transition-colors group">
              <f.icon size={22} className="text-brass mb-4" />
              <p className="font-display text-lg mb-1.5">{f.title}</p>
              <p className="text-sm text-paper/55 leading-relaxed">{f.text}</p>
              <span className="inline-flex items-center gap-1 text-xs text-brass mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Try it <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <TicketCard notch={false} className="relative overflow-hidden px-8 py-14 text-center">
          <img src="https://picsum.photos/seed/vp-cta/1600/500" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          {user ? (
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl mb-4">Keep the momentum going</h2>
              <p className="text-paper/60 max-w-md mx-auto mb-8">
                Every plan you save shows up on your dashboard — favorites, budgets, and full itineraries in one place.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-brass text-ink-800 font-medium px-6 py-3 rounded-full hover:bg-brass-light transition-colors">
                Go to your dashboard <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl mb-4">Start with a place, not a spreadsheet</h2>
              <p className="text-paper/60 max-w-md mx-auto mb-8">
                Create a free account to save trips, track favorites, and pick up your itinerary from any device.
              </p>
              <Link to="/sign-up" className="inline-flex items-center gap-2 bg-brass text-ink-800 font-medium px-6 py-3 rounded-full hover:bg-brass-light transition-colors">
                Create your account <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </TicketCard>
      </section>
    </div>
  );
}
