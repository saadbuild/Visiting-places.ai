import { seededFloat, seededInt, pick, img } from "./_helpers";

const AMENITY_POOL = [
  "Free Wi-Fi", "Rooftop pool", "Spa", "Gym", "Airport shuttle",
  "Breakfast included", "Bar", "Pet friendly", "Concierge", "EV charging",
  "Non-smoking rooms", "Business center", "Laundry service", "Air conditioning",
];

const RAW = {
  paris: [
    ["Hôtel Lumière du Marais", "Luxury", 320],
    ["Studio Rive Gauche", "Apartment", 140],
    ["Le Petit Voyageur Hostel", "Hostel", 42],
  ],
  tokyo: [
    ["Ginza Sky Tower Hotel", "Luxury", 280],
    ["Shinjuku Capsule & Co.", "Budget Hotel", 55],
    ["Asakusa Machiya Villa", "Villa", 190],
  ],
  bali: [
    ["Ubud Canopy Resort", "Resort", 210],
    ["Canggu Surf Villas", "Villa", 165],
    ["Kuta Backpacker Hostel", "Hostel", 24],
  ],
  dubai: [
    ["Marina Skyline Hotel", "Luxury", 340],
    ["Al Fahidi Boutique Apartments", "Apartment", 120],
    ["Desert Palm Resort & Spa", "Resort", 410],
  ],
  "new-york": [
    ["Midtown Meridian Hotel", "Luxury", 380],
    ["Brooklyn Loft Apartments", "Apartment", 175],
    ["Queens Traveler Budget Inn", "Budget Hotel", 90],
  ],
  istanbul: [
    ["Bosphorus View Palace Hotel", "Luxury", 230],
    ["Sultanahmet Heritage Suites", "Villa", 150],
    ["Galata Backpackers Hostel", "Hostel", 28],
  ],
  rome: [
    ["Trastevere Terrace Hotel", "Luxury", 260],
    ["Monti Apartment Residenza", "Apartment", 130],
    ["Colosseo Budget Rooms", "Budget Hotel", 70],
  ],
  "cape-town": [
    ["Table Mountain View Lodge", "Resort", 240],
    ["Camps Bay Villa Retreat", "Villa", 300],
    ["Long Street Backpackers", "Hostel", 22],
  ],
};

function buildHotels(destId, entries) {
  return entries.map(([name, type, price], i) => {
    const seed = `${destId}-hotel-${i}-${name}`;
    return {
      id: `${destId}-hotel-${i}`,
      destinationId: destId,
      name,
      type,
      pricePerNightUSD: price,
      rating: Math.round(seededFloat(seed, 3.6, 5.0) * 10) / 10,
      reviewCount: seededInt(seed + "rc", 80, 2400),
      distanceFromCenterKm: Math.round(seededFloat(seed + "d", 0.4, 8) * 10) / 10,
      amenities: [0, 1, 2, 3, 4].map((n) => pick(seed + "a" + n, AMENITY_POOL)).filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 5),
      cancellation: pick(seed + "cx", ["Free cancellation up to 24h before check-in", "Free cancellation up to 5 days before check-in", "Non-refundable — lower rate"]),
      image: img(seed, 900, 600),
      gallery: [img(seed + "-g1"), img(seed + "-g2"), img(seed + "-g3")],
    };
  });
}

export const hotels = Object.entries(RAW).flatMap(([destId, entries]) =>
  buildHotels(destId, entries)
);

export function hotelsFor(destId) {
  return hotels.filter((h) => h.destinationId === destId);
}

export function getHotel(id) {
  return hotels.find((h) => h.id === id);
}
