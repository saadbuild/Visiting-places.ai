import { useState, useEffect, useCallback } from "react";
import { Search, Droplets, Wind, Sun, Loader2 } from "lucide-react";
import { PageHeader } from "../components/Shared";
import { geocode, getForecast, describeCode, packingSuggestions } from "../lib/weather";

export default function Weather() {
  const [query, setQuery] = useState("Paris");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [place, setPlace] = useState(null);
  const [data, setData] = useState(null);

  const runSearch = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await geocode(city);
      if (results.length === 0) {
        setError("Couldn't find that place. Try a bigger city nearby.");
        setData(null);
        return;
      }
      const top = results[0];
      setPlace(top);
      const forecast = await getForecast(top.latitude, top.longitude);
      setData(forecast);
    } catch (err) {
      setError(err.message || "Something went wrong fetching the forecast.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    runSearch(query);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Weather"
        title="Real forecasts, not guesses"
        subtitle="Live data for any city on earth, plus what to pack based on the week ahead."
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20">
        <form onSubmit={handleSearch} className="ticket flex items-center gap-3 px-5 py-3.5 mb-8">
          <Search size={18} className="text-brass shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a city…"
            className="bg-transparent outline-none flex-1 text-sm"
          />
          <button className="bg-brass text-ink-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-brass-light transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Check"}
          </button>
        </form>

        {error && <p className="text-coral-light text-sm mb-6">{error}</p>}

        {data && place && (
          <>
            <div className="ticket p-8 mb-8 text-center">
              <p className="text-xs uppercase tracking-widest text-brass font-mono">
                {place.name}{place.admin1 ? `, ${place.admin1}` : ""}, {place.country}
              </p>
              <p className="text-7xl my-3">{describeCode(data.current.weather_code).icon}</p>
              <p className="font-display text-5xl">{Math.round(data.current.temperature_2m)}°C</p>
              <p className="text-paper/60 mt-1">{describeCode(data.current.weather_code).label} · feels like {Math.round(data.current.apparent_temperature)}°C</p>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-paper/60">
                <span className="flex items-center gap-1.5"><Droplets size={15} className="text-brass" /> {data.current.relative_humidity_2m}%</span>
                <span className="flex items-center gap-1.5"><Wind size={15} className="text-brass" /> {Math.round(data.current.wind_speed_10m)} km/h</span>
                <span className="flex items-center gap-1.5"><Sun size={15} className="text-brass" /> UV {Math.round(data.current.uv_index)}</span>
              </div>
            </div>

            <p className="font-display text-xl mb-4">7-day forecast</p>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 mb-10">
              {data.daily.time.map((day, i) => (
                <div key={day} className="ticket p-3 text-center">
                  <p className="text-xs text-paper/50">{new Date(day).toLocaleDateString(undefined, { weekday: "short" })}</p>
                  <p className="text-2xl my-1.5">{describeCode(data.daily.weather_code[i]).icon}</p>
                  <p className="text-xs font-mono">{Math.round(data.daily.temperature_2m_max[i])}° / {Math.round(data.daily.temperature_2m_min[i])}°</p>
                </div>
              ))}
            </div>

            <div className="ticket p-6">
              <p className="font-display text-lg mb-3">What to pack</p>
              <ul className="space-y-2">
                {packingSuggestions(data.daily).map((tip) => (
                  <li key={tip} className="text-sm text-paper/65 flex gap-2">
                    <span className="text-brass">—</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
