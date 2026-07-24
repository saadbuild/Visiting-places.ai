import { seededFloat, seededInt, pick, img } from "./_helpers";
import { destinations } from "./destinations";

const AIRLINES = [
  "Meridian Air", "AtlasJet", "Northwind Airways", "Skyline Global",
  "Horizon Air", "Continental Wings", "Pacific Route", "Aurora Airlines",
];

// Deterministic mock flight generator — swap for a real GDS/flight API
// (Amadeus, Skyscanner, Duffel) by replacing this function's body.
export function searchFlights({ fromCity, toDestId, date, travelClass = "Economy" }) {
  const dest = destinations.find((d) => d.id === toDestId);
  if (!dest) return [];

  const baseSeed = `${fromCity}-${toDestId}-${date}`;
  const results = [0, 1, 2, 3, 4].map((i) => {
    const seed = baseSeed + i;
    const stops = seededInt(seed + "s", 0, 2);
    const durationHrs = Math.round(seededFloat(seed + "dur", 2, 18) * 10) / 10;
    const basePrice = seededInt(seed + "p", 90, 1400);
    const classMultiplier = travelClass === "Business" ? 3.2 : travelClass === "Premium" ? 1.8 : 1;
    return {
      id: `${toDestId}-flight-${i}`,
      airline: pick(seed + "air", AIRLINES),
      logo: img(seed + "-logo", 80, 80),
      fromCity,
      toCity: dest.name,
      departure: `${seededInt(seed + "dh", 5, 22)}:${pick(seed + "dm", ["00", "15", "30", "45"])}`,
      arrival: `${seededInt(seed + "ah", 5, 23)}:${pick(seed + "am", ["00", "15", "30", "45"])}`,
      durationHrs,
      stops,
      travelClass,
      priceUSD: Math.round(basePrice * classMultiplier),
    };
  });

  return results.sort((a, b) => a.priceUSD - b.priceUSD);
}
