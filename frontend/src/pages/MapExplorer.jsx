import { useState } from "react";
import { PageHeader } from "../components/Shared";
import MapView from "../components/MapView";
import { fetchNearby, NEARBY_CATEGORIES } from "../lib/places";
import { distanceKm } from "../lib/format";
import { LocateFixed, Loader2 } from "lucide-react";

const CATEGORY_LABELS = {
  hotels: "Hotels", restaurants: "Restaurants", hospitals: "Hospitals", fuel: "Fuel stations",
  ev_charging: "EV charging", malls: "Shopping malls", parks: "Parks", museums: "Museums",
  attractions: "Attractions", public_transport: "Public transport", mosques: "Mosques",
  churches: "Churches", temples: "Temples", pharmacies: "Pharmacies", parking: "Parking",
  atms: "ATMs", airports: "Airports", bus_stations: "Bus stations", railway_stations: "Railway stations",
};

export default function MapExplorer() {
  const [coords, setCoords] = useState(null);
  const [category, setCategory] = useState("restaurants");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function locate() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation isn't available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError("Couldn't get your location — check browser permissions, or the map defaults to Paris."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function search(cat = category) {
    const base = coords || { lat: 48.8566, lon: 2.3522 };
    setLoading(true);
    setError(null);
    try {
      const places = await fetchNearby(cat, base.lat, base.lon);
      setResults(
        places
          .map((p) => ({ ...p, distance: distanceKm(base.lat, base.lon, p.lat, p.lon) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 20)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const center = coords ? [coords.lat, coords.lon] : [48.8566, 2.3522];

  return (
    <div>
      <PageHeader
        eyebrow="Live map"
        title="What's actually nearby"
        subtitle="Real OpenStreetMap data — hotels, hospitals, fuel stops, transit, and more, near you or any point on the map."
      >
        <button onClick={locate} className="flex items-center gap-2 text-sm bg-ink-700 border border-paper/15 px-4 py-2 rounded-full hover:border-brass/50 transition-colors">
          <LocateFixed size={15} className="text-brass" /> Use my location
        </button>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setCategory(key); search(key); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === key ? "bg-brass text-ink-800 border-brass" : "border-paper/15 text-paper/60 hover:border-brass/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="text-coral-light text-sm mb-4">{error}</p>}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              center={center}
              zoom={coords ? 14 : 12}
              markers={results.map((r) => ({ lat: r.lat, lon: r.lon, name: r.name, subtitle: `${r.distance.toFixed(1)} km away` }))}
              height={500}
            />
          </div>
          <div className="ticket p-5 max-h-[500px] overflow-y-auto">
            <p className="font-display text-lg mb-4">{CATEGORY_LABELS[category]}</p>
            {loading && <p className="text-sm text-paper/50 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Searching…</p>}
            {!loading && results.length === 0 && (
              <p className="text-sm text-paper/45">Pick a category above to search nearby.</p>
            )}
            <div className="flex flex-col gap-3">
              {results.map((r) => (
                <div key={r.id} className="border-b border-paper/10 pb-3 last:border-0">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-paper/45 mt-0.5">{r.distance.toFixed(1)} km away</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
