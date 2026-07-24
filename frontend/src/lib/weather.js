// Open-Meteo is free and requires no API key — perfect for a self-hosted demo.
// Docs: https://open-meteo.com/

export async function geocode(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Couldn't look up that place.");
  const data = await res.json();
  return data.results || [];
}

export async function getForecast(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max` +
    `&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Couldn't fetch the forecast.");
  return res.json();
}

// WMO weather codes -> label + emoji, per Open-Meteo docs.
export const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm w/ hail", icon: "⛈️" },
  99: { label: "Thunderstorm w/ hail", icon: "⛈️" },
};

export function describeCode(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: "🌡️" };
}

export function packingSuggestions(daily) {
  const tips = [];
  if (!daily) return tips;
  const maxTemp = Math.max(...daily.temperature_2m_max);
  const minTemp = Math.min(...daily.temperature_2m_min);
  const rain = Math.max(...(daily.precipitation_probability_max || [0]));
  const uv = Math.max(...(daily.uv_index_max || [0]));

  if (maxTemp >= 28) tips.push("Light, breathable fabrics and a refillable water bottle");
  if (minTemp <= 10) tips.push("A warm layer or jacket for cool mornings and evenings");
  if (rain >= 40) tips.push("A compact umbrella or rain shell");
  if (uv >= 6) tips.push("Sunscreen and sunglasses — UV is high");
  if (tips.length === 0) tips.push("Everyday layers — conditions look mild and steady");
  return tips;
}
