import { destinations } from "../data/destinations";

function findDestinationMention(text) {
  const lower = text.toLowerCase();
  return destinations.find((d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.country.toLowerCase()));
}

const RULES = [
  {
    test: /visa/i,
    respond: (dest) =>
      dest
        ? `Visa rules for ${dest.name} depend on your passport — most travelers should check the official ${dest.country} immigration site or embassy before booking. As a rule of thumb: many nationalities get visa-free or visa-on-arrival stays under 30–90 days, but always confirm with your embassy directly since policies change.`
        : "Visa requirements depend entirely on your passport and destination — tell me which country you're visiting and I'll point you toward what to check, though you should always confirm with the destination's embassy directly.",
  },
  {
    test: /currency|money|exchange rate/i,
    respond: (dest) =>
      dest
        ? `${dest.name} uses the ${dest.currency}. Card payments are widely accepted in cities, but carry some local cash for markets, small eateries, and rural areas. Check the Budget Planner to estimate costs in your home currency.`
        : "Tell me a destination and I'll tell you the local currency — or use the Budget Planner, which converts everything automatically.",
  },
  {
    test: /pack|what to bring|luggage/i,
    respond: (dest) =>
      `Packing depends on season and activity — check the Weather page for a live forecast and a packing list generated from that week's actual conditions${dest ? ` in ${dest.name}` : ""}.`,
  },
  {
    test: /safe|safety|danger|crime/i,
    respond: (dest) =>
      `General safety basics apply almost everywhere: keep valuables out of sight, use registered taxis or ride apps, share your itinerary with someone at home, and check your government's travel advisory page for${dest ? ` ${dest.country}` : " your destination"} before you go.`,
  },
  {
    test: /budget|cost|expensive|cheap/i,
    respond: (dest) =>
      `Costs vary a lot by travel style. Use the Budget Planner to break down flights, hotels, food, and activities${dest ? ` for ${dest.name}` : ""} — it updates live as you adjust each line item.`,
  },
  {
    test: /food|eat|restaurant|dish/i,
    respond: (dest) =>
      dest
        ? `${dest.name} is known for a few standout dishes — check the Local Foods and Restaurants pages, filtered to ${dest.name}, for specifics and average prices.`
        : "Tell me a destination and I'll point you to its most famous dishes on the Local Foods page.",
  },
  {
    test: /hotel|stay|accommodation/i,
    respond: (dest) =>
      dest
        ? `For ${dest.name}, the Hotels page lets you filter by type (luxury, resort, apartment, hostel, villa, budget) and price — I'd start there.`
        : "Head to the Hotels page and filter by destination, type, and price to compare stays.",
  },
  {
    test: /itinerary|plan|schedule/i,
    respond: (dest) =>
      `The AI Trip Planner will build a full day-by-day itinerary${dest ? ` for ${dest.name}` : ""} based on your interests and length of stay — want me to take you there?`,
  },
  {
    test: /weather|rain|temperature|climate/i,
    respond: (dest) =>
      `Check the Weather page for a live forecast${dest ? ` in ${dest.name}` : ""} — it's real data, not a seasonal average, so it's accurate for your actual travel dates.`,
  },
  {
    test: /fuel|gas|road trip|driving/i,
    respond: () =>
      "The Fuel Calculator works out fuel or charging cost, tolls, and parking for any road trip distance — just plug in your vehicle type and route length.",
  },
  {
    test: /hi|hello|hey/i,
    respond: () => "Hey — where are you headed? Tell me a destination and what's on your mind (budget, food, safety, packing) and I'll point you in the right direction.",
  },
];

const FALLBACK =
  "I can help with visas, currency, packing, safety, food, hotels, budgets, and itineraries — try asking about one of those, or name a destination and I'll tailor the answer.";

export function respond(message) {
  const dest = findDestinationMention(message);
  const rule = RULES.find((r) => r.test.test(message));
  if (rule) return rule.respond(dest);
  return dest
    ? `${dest.name}, ${dest.country} — good choice. Ask me about visas, currency, food, safety, weather, or budget and I'll get specific.`
    : FALLBACK;
}

export const SUGGESTIONS = [
  "What's the food like in Tokyo?",
  "Do I need a visa for Dubai?",
  "Is Cape Town safe for solo travelers?",
  "What should I pack for Bali?",
  "How much does a week in Rome cost?",
];
