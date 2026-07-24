// Subscription plan catalog.
//
// PKR -> USD is a real but constantly-moving rate. As of writing (mid-2026) USD/PKR sits
// around 278. That's baked in below as an approximation, purely so a dollar figure can be
// shown next to the rupee price for international reference — update FX_RATE occasionally,
// or wire this up to a live exchange-rate API in production.
const FX_RATE = 278; // 1 USD ≈ 278 PKR (approximate)

function toUsd(rs) {
  return Math.round((rs / FX_RATE) * 100) / 100;
}

const PLANS = {
  basic: {
    id: "basic",
    name: "Basic",
    tagline: "Begin your story, on the house",
    priceRs: 0,
    priceUsd: 0,
    billingNote: "Free",
    credits: 150,
    creditsNote: "150 free AI credits (enough for one full AI itinerary), one-time",
    features: [
      "150 free AI credits to try the AI trip planner & AI assistant",
      "Browse all destinations, hotels, restaurants, foods & attractions",
      "Save up to 3 trips and favorites",
    ],
    upgradeHint: "Once your free credits run out, upgrade for PKR 999/mo — or move up to Standard for weather, budgeting & fuel tools plus far more credits.",
  },
  basicPlus: {
    id: "basicPlus",
    name: "Basic+",
    tagline: "Keep going on Basic once your free credits end",
    priceRs: 999,
    priceUsd: toUsd(999),
    billingNote: "per month",
    credits: 60,
    creditsNote: "60 AI credits every month",
    features: [
      "Everything in Basic, with the free-credit cap removed",
      "60 AI credits per month for the trip planner & AI assistant",
      "Save up to 10 trips and favorites",
    ],
    hiddenFromMainGrid: true,
  },
  standard: {
    id: "standard",
    name: "Standard",
    tagline: "For the seasoned voyager",
    priceRs: 1499,
    priceUsd: toUsd(1499),
    billingNote: "per month",
    credits: 25000,
    creditsNote: "25,000 AI credits every month",
    features: [
      "Everything in Basic",
      "25,000 AI credits per month for the trip planner & AI assistant",
      "Weather, budget planner & fuel calculator",
      "Unlimited saved trips & favorites",
      "Priority AI trip-planner generation",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "The full concierge experience",
    priceRs: 2999,
    priceUsd: toUsd(2999),
    billingNote: "per month",
    credits: 50000,
    creditsNote: "50,000 AI credits every month",
    features: [
      "Everything in Standard",
      "50,000 AI credits per month for the trip planner & AI assistant",
      "Full live map with real-time location sharing",
      "Advanced AI itinerary rewrites & re-planning",
      "Early access to new features",
      "Priority email support from the Techtig team",
    ],
  },
  owner: {
    id: "owner",
    name: "Owner",
    tagline: "Full platform access for the Techtig team",
    priceRs: 0,
    priceUsd: 0,
    billingNote: "Free — owner account",
    credits: Infinity,
    creditsNote: "Unlimited AI credits, no billing",
    features: [
      "Every feature of every plan, always free",
      "Skips the JazzCash/EasyPaisa/NayaPay payment flow entirely",
      "Access to payment verification in Admin",
    ],
    hiddenFromMainGrid: true,
  },
};

const PAYMENT_METHODS = {
  jazzcash: { id: "jazzcash", label: "JazzCash", number: "03145490566" },
  easypaisa: { id: "easypaisa", label: "EasyPaisa", number: "03145490566" },
  nayapay: { id: "nayapay", label: "NayaPay", iban: "PK33NAUA1234503145490566" },
};

module.exports = { PLANS, PAYMENT_METHODS, FX_RATE, toUsd };
