import { useState } from "react";
import { destinations } from "../data/destinations";
import { searchFlights } from "../data/flights";
import { PageHeader } from "../components/Shared";
import { Plane, ArrowRight, Clock } from "lucide-react";

const CLASSES = ["Economy", "Premium", "Business"];

export default function Flights() {
  const [fromCity, setFromCity] = useState("New York");
  const [toDestId, setToDestId] = useState(destinations[0].id);
  const [date, setDate] = useState("");
  const [travelClass, setTravelClass] = useState("Economy");
  const [results, setResults] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    setResults(searchFlights({ fromCity, toDestId, date: date || "flex", travelClass }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Fly"
        title="Compare flights, not tabs"
        subtitle="Cheapest, fastest, and everything with a layover you'll regret."
      />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-20">
        <form onSubmit={handleSearch} className="ticket p-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <label className="text-sm">
            <span className="text-paper/50 text-xs">From</span>
            <input
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
              placeholder="Departure city"
            />
          </label>
          <label className="text-sm">
            <span className="text-paper/50 text-xs">To</span>
            <select
              value={toDestId}
              onChange={(e) => setToDestId(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
            >
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-paper/50 text-xs">Depart</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="text-paper/50 text-xs">Class</span>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
            >
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button className="bg-brass text-ink-800 font-medium rounded-lg py-2.5 hover:bg-brass-light transition-colors">
            Search flights
          </button>
        </form>

        {results && (
          <div className="mt-8 flex flex-col gap-4">
            {results.map((f) => (
              <div key={f.id} className="ticket p-5 flex flex-wrap items-center gap-5 justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-brass/15">
                    <Plane size={16} className="text-brass" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{f.airline}</p>
                    <p className="text-xs text-paper/45">{f.travelClass}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>{f.departure}</span>
                  <span className="text-paper/40">{f.fromCity}</span>
                  <ArrowRight size={14} className="text-brass" />
                  <span>{f.arrival}</span>
                  <span className="text-paper/40">{f.toCity}</span>
                </div>
                <p className="text-xs text-paper/50 flex items-center gap-1">
                  <Clock size={13} /> {f.durationHrs}h · {f.stops === 0 ? "Nonstop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}
                </p>
                <p className="text-xl font-display text-brass">${f.priceUSD}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
