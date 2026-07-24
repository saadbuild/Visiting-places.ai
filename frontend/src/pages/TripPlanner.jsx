import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Save, Calendar } from "lucide-react";
import { destinations, getDestination } from "../data/destinations";
import { hotelsFor } from "../data/hotels";
import { restaurantsFor } from "../data/restaurants";
import { attractionsFor } from "../data/attractions";
import { PageHeader } from "../components/Shared";
import RouteLine from "../components/RouteLine";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripsContext";
import { useApp } from "../context/AppContext";
import { useSubscription } from "../context/SubscriptionContext";
import { formatMoney } from "../lib/format";

const INTERESTS = ["Adventure", "Beaches", "Food", "Museums", "Historical Places", "Nature", "Nightlife", "Shopping"];

function buildItinerary({ destId, nights, interests, hotel }) {
  const attractions = attractionsFor(destId);
  const restaurants = restaurantsFor(destId);
  const preferred = interests.length
    ? attractions.filter((a) => interests.some((i) => a.category.toLowerCase().includes(i.toLowerCase().split(" ")[0])))
    : attractions;
  const pool = preferred.length ? preferred : attractions;

  const days = [];
  for (let day = 1; day <= nights; day++) {
    const morningAttraction = pool[(day - 1) % pool.length] || attractions[0];
    const eveningAttraction = attractions[day % attractions.length];
    const lunchSpot = restaurants[(day - 1) % restaurants.length];
    const dinnerSpot = restaurants[day % restaurants.length];
    const dayCost =
      (morningAttraction?.entryFeeUSD || 0) +
      (eveningAttraction?.entryFeeUSD || 0) +
      35 + // rough food estimate
      (hotel?.pricePerNightUSD || 0);

    days.push({
      day,
      morning: morningAttraction,
      lunch: lunchSpot,
      evening: eveningAttraction,
      dinner: dinnerSpot,
      estimatedCostUSD: Math.round(dayCost),
    });
  }
  return days;
}

export default function TripPlanner() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { saveTrip } = useTrips();
  const { notify } = useApp();
  const { consumeCredit, isOutOfCredits, creditsRemaining, isUnlimited } = useSubscription();
  const PLAN_COST = 150;
  const insufficientCredits = !isUnlimited && (creditsRemaining ?? 0) < PLAN_COST;

  const [destId, setDestId] = useState(params.get("destination") || destinations[0].id);
  const [startDate, setStartDate] = useState("");
  const [nights, setNights] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const dest = getDestination(destId);
  const hotelOptions = hotelsFor(destId);

  function toggleInterest(i) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  async function generate(e) {
    e.preventDefault();
    if (isOutOfCredits || insufficientCredits) {
      notify(
        `Generating a full itinerary costs ${PLAN_COST} AI credits — upgrade your plan for more.`,
        "info"
      );
      return;
    }
    const ok = await consumeCredit(PLAN_COST);
    if (!ok) {
      notify(
        `Generating a full itinerary costs ${PLAN_COST} AI credits — upgrade your plan for more.`,
        "info"
      );
      return;
    }
    const hotel = hotelOptions[0];
    setItinerary(buildItinerary({ destId, nights, interests, hotel }));
  }

  async function handleSave() {
    if (!user) {
      notify("Sign in to save this itinerary.", "info");
      return;
    }
    setSaving(true);
    try {
      const total = itinerary.reduce((sum, d) => sum + d.estimatedCostUSD, 0) * travelers;
      await saveTrip({
        title: `${dest.name} trip`,
        destination: dest.name,
        startDate: startDate || null,
        travelers,
        itinerary,
        budget: total,
      });
      notify("Trip saved to your dashboard.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Trip Planner"
        title="A full itinerary, built in seconds"
        subtitle="Pick a destination and interests — we'll lay out mornings, meals, and evenings for every day."
      />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-20">
        {(isOutOfCredits || insufficientCredits) && (
          <div className="ticket p-4 mb-5 flex items-center justify-between gap-3 border-coral/40">
            <p className="text-sm text-paper/60">
              {isOutOfCredits
                ? "You're out of AI credits."
                : `You need ${PLAN_COST} AI credits for a full itinerary — you have ${creditsRemaining ?? 0} left.`}
            </p>
            <Link to="/pricing" className="shrink-0 text-xs font-medium bg-brass text-ink-800 px-4 py-2 rounded-full hover:bg-brass-light transition-colors">
              Upgrade
            </Link>
          </div>
        )}
        <form onSubmit={generate} className="ticket p-6 grid sm:grid-cols-2 gap-5 mb-10">
          <label className="block">
            <span className="text-xs text-paper/50">Destination</span>
            <select value={destId} onChange={(e) => setDestId(e.target.value)} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none">
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Start date</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none" />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Nights</span>
            <input type="number" min={1} max={14} value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono" />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Travelers</span>
            <input type="number" min={1} max={12} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono" />
          </label>
          <div className="sm:col-span-2">
            <span className="text-xs text-paper/50">Interests</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTERESTS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    interests.includes(i) ? "bg-brass text-ink-800 border-brass" : "border-paper/15 text-paper/60 hover:border-brass/50"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col items-center gap-2">
            <button className="w-full flex items-center justify-center gap-2 bg-brass text-ink-800 font-medium py-3 rounded-full hover:bg-brass-light transition-colors">
              <Sparkles size={17} /> Generate itinerary
            </button>
            <p className="text-[11px] text-paper/40 font-mono tracking-wide">
              {PLAN_COST} AI credits per itinerary
              {!isUnlimited && ` · ${creditsRemaining ?? 0} remaining`}
            </p>
          </div>
        </form>

        {itinerary && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">Your {dest.name} itinerary</h2>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 text-sm bg-ink-700 border border-paper/15 px-4 py-2 rounded-full hover:border-brass/50 transition-colors">
                <Save size={15} /> {saving ? "Saving…" : "Save trip"}
              </button>
            </div>

            <div className="flex flex-col">
              {itinerary.map((d, idx) => (
                <div key={d.day}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="ticket p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-display text-xl flex items-center gap-2">
                        <Calendar size={16} className="text-brass" /> Day {d.day}
                      </p>
                      <span className="text-brass font-mono text-sm">~{formatMoney(d.estimatedCostUSD)}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-brass font-mono uppercase mb-1">Morning</p>
                        <p>{d.morning?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brass font-mono uppercase mb-1">Lunch</p>
                        <p>{d.lunch?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brass font-mono uppercase mb-1">Evening</p>
                        <p>{d.evening?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brass font-mono uppercase mb-1">Dinner</p>
                        <p>{d.dinner?.name}</p>
                      </div>
                    </div>
                  </motion.div>
                  {idx < itinerary.length - 1 && (
                    <div className="flex justify-center"><RouteLine height={28} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
