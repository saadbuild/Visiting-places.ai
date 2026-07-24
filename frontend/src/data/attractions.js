import { seededFloat, seededInt, pick, img } from "./_helpers";

const RAW = {
  paris: [
    ["Eiffel Tower", "Landmark", 28, 2, "The city's defining silhouette; go up at dusk for the light show."],
    ["Louvre Museum", "Museum", 20, 3, "The world's largest art museum — pick two wings, not the whole building."],
    ["Montmartre & Sacré-Cœur", "Historical", 0, 2, "Cobbled streets and a basilica with the best free view in Paris."],
  ],
  tokyo: [
    ["Senso-ji Temple", "Religious", 0, 1.5, "Tokyo's oldest temple, framed by a lantern-lit shopping street."],
    ["TeamLab Planets", "Museum", 32, 2, "A barefoot, immersive digital-art experience — book ahead."],
    ["Shibuya Crossing", "Landmark", 0, 0.5, "The world's busiest pedestrian crossing, best viewed from above."],
  ],
  bali: [
    ["Tegalalang Rice Terraces", "Nature", 3, 1.5, "Stepped emerald terraces near Ubud, best photographed early morning."],
    ["Uluwatu Temple", "Religious", 4, 2, "Clifftop temple with a sunset kecak fire dance performance."],
    ["Mount Batur Sunrise Trek", "Adventure", 15, 4, "A pre-dawn hike rewarded with a volcano-rim sunrise."],
  ],
  dubai: [
    ["Burj Khalifa", "Landmark", 40, 1.5, "The world's tallest building; book the 124th-floor deck in advance."],
    ["Dubai Desert Safari", "Adventure", 55, 4, "Dune bashing, camel rides, and a Bedouin-style dinner camp."],
    ["Dubai Mall & Aquarium", "Shopping", 12, 3, "Retail on a civic scale, plus a 10-million-liter aquarium tank."],
  ],
  "new-york": [
    ["Statue of Liberty & Ellis Island", "Historical", 24, 3, "Ferry access only — book the early crossing to beat the lines."],
    ["Metropolitan Museum of Art", "Museum", 30, 3, "Pay-what-you-wish for NY residents; everyone else, plan half a day."],
    ["Central Park", "Nature", 0, 2, "843 acres of green in the middle of Manhattan — rent a bike."],
  ],
  istanbul: [
    ["Hagia Sophia", "Religious", 25, 1.5, "Byzantine church turned mosque turned museum turned mosque again."],
    ["Grand Bazaar", "Shopping", 0, 2, "4,000 shops under one historic roof — haggling is expected."],
    ["Bosphorus Ferry Cruise", "Nature", 8, 1.5, "The cheapest great view in the city, at commuter-ferry prices."],
  ],
  rome: [
    ["Colosseum", "Historical", 18, 2, "Book the underground-access ticket if you want the gladiator tunnels."],
    ["Vatican Museums & Sistine Chapel", "Museum", 21, 3, "Arrive at opening time or the Chapel becomes standing-room only."],
    ["Trevi Fountain", "Landmark", 0, 0.5, "Toss a coin over your shoulder — legend says you'll return to Rome."],
  ],
  "cape-town": [
    ["Table Mountain Cableway", "Nature", 26, 2, "Rotating cable car; check the wind forecast before you go."],
    ["Robben Island", "Historical", 25, 3.5, "Former prison island, tours often led by ex-political prisoners."],
    ["Cape of Good Hope", "Nature", 11, 3, "Windswept reserve where two oceans meet, with resident penguins nearby."],
  ],
};

const CROWD_LEVELS = ["Low", "Moderate", "High"];

function buildAttractions(destId, entries) {
  return entries.map(([name, category, fee, hours, description], i) => {
    const seed = `${destId}-attr-${i}-${name}`;
    return {
      id: `${destId}-attr-${i}`,
      destinationId: destId,
      name,
      category,
      entryFeeUSD: fee,
      visitDurationHrs: hours,
      description,
      rating: Math.round(seededFloat(seed, 4.0, 5.0) * 10) / 10,
      reviewCount: seededInt(seed + "rc", 500, 40000),
      crowdLevel: pick(seed + "cl", CROWD_LEVELS),
      bestTime: pick(seed + "bt", ["Early morning", "Late afternoon", "Weekday mornings", "Just before closing"]),
      openHours: fee === 0 ? "Open 24 hours" : pick(seed + "oh", ["9:00 AM – 6:00 PM", "10:00 AM – 5:00 PM", "8:00 AM – 8:00 PM"]),
      image: img(seed, 900, 600),
    };
  });
}

export const attractions = Object.entries(RAW).flatMap(([destId, entries]) =>
  buildAttractions(destId, entries)
);

export function attractionsFor(destId) {
  return attractions.filter((a) => a.destinationId === destId);
}
