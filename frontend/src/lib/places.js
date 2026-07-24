// Overpass API queries live OpenStreetMap data — free, no API key needed.
// Docs: https://wiki.openstreetmap.org/wiki/Overpass_API

const ENDPOINT = "https://overpass-api.de/api/interpreter";

// Category -> Overpass tag filter
export const NEARBY_CATEGORIES = {
  hotels: 'node["tourism"="hotel"]',
  restaurants: 'node["amenity"="restaurant"]',
  hospitals: 'node["amenity"="hospital"]',
  fuel: 'node["amenity"="fuel"]',
  ev_charging: 'node["amenity"="charging_station"]',
  malls: 'node["shop"="mall"]',
  parks: 'node["leisure"="park"]',
  museums: 'node["tourism"="museum"]',
  attractions: 'node["tourism"="attraction"]',
  public_transport: 'node["public_transport"="stop_position"]',
  mosques: 'node["amenity"="place_of_worship"]["religion"="muslim"]',
  churches: 'node["amenity"="place_of_worship"]["religion"="christian"]',
  temples: 'node["amenity"="place_of_worship"]["religion"~"hindu|buddhist"]',
  pharmacies: 'node["amenity"="pharmacy"]',
  parking: 'node["amenity"="parking"]',
  atms: 'node["amenity"="atm"]',
  airports: 'node["aeroway"="aerodrome"]',
  bus_stations: 'node["amenity"="bus_station"]',
  railway_stations: 'node["railway"="station"]',
};

export async function fetchNearby(category, lat, lon, radiusMeters = 4000) {
  const filter = NEARBY_CATEGORIES[category];
  if (!filter) throw new Error("Unknown category: " + category);

  const query = `
    [out:json][timeout:25];
    (
      ${filter}(around:${radiusMeters},${lat},${lon});
    );
    out center 30;
  `;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!res.ok) throw new Error("Nearby-places lookup failed. Try again shortly.");
  const data = await res.json();

  return (data.elements || [])
    .filter((el) => el.lat && el.lon)
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || "Unnamed place",
      lat: el.lat,
      lon: el.lon,
      tags: el.tags || {},
    }));
}
