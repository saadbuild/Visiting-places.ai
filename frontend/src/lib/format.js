export const CURRENCIES = {
  USD: { symbol: "$", rateToUSD: 1 },
  EUR: { symbol: "€", rateToUSD: 0.92 },
  GBP: { symbol: "£", rateToUSD: 0.78 },
  PKR: { symbol: "₨", rateToUSD: 278 },
  INR: { symbol: "₹", rateToUSD: 83.5 },
  AED: { symbol: "AED", rateToUSD: 3.67 },
  JPY: { symbol: "¥", rateToUSD: 156 },
  AUD: { symbol: "A$", rateToUSD: 1.5 },
};

// All internal amounts are stored in USD; convert for display only.
export function formatMoney(amountUSD, currency = "USD") {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountUSD * cfg.rateToUSD;
  const decimals = converted >= 1000 ? 0 : 2;
  return `${cfg.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function convert(amountUSD, currency = "USD") {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  return amountUSD * cfg.rateToUSD;
}

// Haversine distance in kilometers
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
