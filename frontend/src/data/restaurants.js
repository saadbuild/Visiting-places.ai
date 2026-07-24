import { seededFloat, seededInt, pick, img } from "./_helpers";

const RAW = {
  paris: [
    ["Bistro des Halles", "French", "$$$", ["Steak frites", "Duck confit", "Onion soup"]],
    ["Le Marché Vert", "Vegetarian", "$$", ["Ratatouille tart", "Lentil salad"]],
    ["Boulangerie Corner", "Bakery / Fast", "$", ["Croissant", "Jambon-beurre baguette"]],
  ],
  tokyo: [
    ["Kanda Ramen Dojo", "Ramen", "$", ["Tonkotsu ramen", "Gyoza"]],
    ["Sushi Ichiban", "Sushi / Fine Dining", "$$$", ["Omakase set", "Uni nigiri"]],
    ["Shibuya Yakitori Alley", "Yakitori", "$$", ["Grilled chicken skewers", "Edamame"]],
  ],
  bali: [
    ["Ubud Warung Sehat", "Local Cuisine", "$", ["Nasi campur", "Gado-gado"]],
    ["Canggu Seaside Grill", "Seafood", "$$", ["Grilled snapper", "Prawn satay"]],
    ["Sunset Vegan Kitchen", "Vegan", "$$", ["Jackfruit rendang", "Buddha bowl"]],
  ],
  dubai: [
    ["Al Fahidi Grill House", "Middle Eastern / Halal", "$$", ["Mixed grill platter", "Lamb ouzi"]],
    ["Marina Fine Dining", "Fine Dining", "$$$$", ["Wagyu tasting menu", "Truffle risotto"]],
    ["Souk Street Kitchen", "Street Food", "$", ["Shawarma wrap", "Falafel plate"]],
  ],
  "new-york": [
    ["Brooklyn Slice Co.", "Fast Food / Pizza", "$", ["NY cheese slice", "Garlic knots"]],
    ["Midtown Chophouse", "Fine Dining", "$$$$", ["Dry-aged ribeye", "Lobster tail"]],
    ["Queens Curry House", "South Asian", "$$", ["Butter chicken", "Lamb biryani"]],
  ],
  istanbul: [
    ["Sultanahmet Kebab Evi", "Turkish / Halal", "$$", ["Adana kebab", "Iskender"]],
    ["Bosphorus Balik Ekmek", "Seafood", "$", ["Fish sandwich", "Grilled mackerel"]],
    ["Galata Meze Table", "Turkish Fine Dining", "$$$", ["Meze platter", "Grilled octopus"]],
  ],
  rome: [
    ["Trattoria Trastevere", "Italian", "$$", ["Cacio e pepe", "Carbonara"]],
    ["Monti Pizza al Taglio", "Fast Food / Pizza", "$", ["Roman-style pizza slice"]],
    ["Testaccio Fine Dining", "Italian Fine Dining", "$$$$", ["Tasting menu", "Wine pairing"]],
  ],
  "cape-town": [
    ["Camps Bay Seafood Shack", "Seafood", "$$", ["Grilled kingklip", "Prawn linguine"]],
    ["Long Street Braai House", "Local Cuisine", "$$", ["Boerewors platter", "Bobotie"]],
    ["Winelands Vegan Table", "Vegan", "$$$", ["Roasted veg tasting plate"]],
  ],
};

function buildRestaurants(destId, entries) {
  return entries.map(([name, cuisine, priceRange, dishes], i) => {
    const seed = `${destId}-resto-${i}-${name}`;
    return {
      id: `${destId}-resto-${i}`,
      destinationId: destId,
      name,
      cuisine,
      priceRange,
      popularDishes: dishes,
      rating: Math.round(seededFloat(seed, 3.7, 5.0) * 10) / 10,
      reviewCount: seededInt(seed + "rc", 60, 1800),
      openingHours: pick(seed + "oh", ["11:00 AM – 10:00 PM", "12:00 PM – 11:00 PM", "8:00 AM – 9:00 PM", "5:00 PM – 12:00 AM"]),
      reservationNeeded: seededFloat(seed + "res", 0, 1) > 0.5,
      distanceFromCenterKm: Math.round(seededFloat(seed + "d", 0.2, 6) * 10) / 10,
      image: img(seed, 900, 600),
    };
  });
}

export const restaurants = Object.entries(RAW).flatMap(([destId, entries]) =>
  buildRestaurants(destId, entries)
);

export function restaurantsFor(destId) {
  return restaurants.filter((r) => r.destinationId === destId);
}

export function getRestaurant(id) {
  return restaurants.find((r) => r.id === id);
}
