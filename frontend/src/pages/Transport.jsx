import { useState } from "react";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations";
import { PageHeader } from "../components/Shared";
import {
  Plane, TrainFront, Bus, Car, Bike, PersonStanding, Bike as Motorbike,
} from "lucide-react";

const MODES = [
  { icon: Plane, label: "Flights", note: "Fastest for anything over 500 km — compare on the Flights page." },
  { icon: TrainFront, label: "Trains", note: "Often the most scenic and least stressful option city-to-city." },
  { icon: Bus, label: "Bus", note: "Cheapest for regional travel; overnight buses save a hotel night." },
  { icon: Car, label: "Rental car", note: "Best for flexibility on road trips — pair with the fuel calculator." },
  { icon: Motorbike, label: "Motorcycle rental", note: "Popular in Southeast Asia; check local license requirements." },
  { icon: PersonStanding, label: "Walking", note: "The only way to actually see a historic old town." },
  { icon: Bike, label: "Cycling", note: "Many cities now have solid bike-share networks." },
];

export default function Transport() {
  const [destId, setDestId] = useState(destinations[0].id);

  return (
    <div>
      <PageHeader
        eyebrow="Move around"
        title="Getting there, and getting around"
        subtitle="A quick guide to transportation modes — pick a destination for local notes."
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        <select
          value={destId}
          onChange={(e) => setDestId(e.target.value)}
          className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none mb-8"
        >
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODES.map((m) => (
            <div key={m.label} className="ticket p-6">
              <m.icon size={22} className="text-brass mb-3" />
              <p className="font-display text-lg">{m.label}</p>
              <p className="text-sm text-paper/55 mt-2 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>

        <div className="ticket p-6 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg">Driving yourself?</p>
            <p className="text-sm text-paper/55 mt-1">Work out fuel and toll costs before you commit to a route.</p>
          </div>
          <Link to="/fuel-calculator" className="bg-brass text-ink-800 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors shrink-0">
            Open fuel calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
