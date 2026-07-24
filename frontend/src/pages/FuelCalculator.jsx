import { useMemo, useState } from "react";
import { PageHeader } from "../components/Shared";
import { useApp } from "../context/AppContext";
import { formatMoney, CURRENCIES } from "../lib/format";
import { Fuel, Zap } from "lucide-react";

const VEHICLES = [
  { label: "Compact car", mpg: 35, kwhPer100km: 15 },
  { label: "Sedan", mpg: 30, kwhPer100km: 17 },
  { label: "SUV", mpg: 22, kwhPer100km: 22 },
  { label: "Pickup truck", mpg: 18, kwhPer100km: 28 },
  { label: "Motorcycle", mpg: 55, kwhPer100km: 8 },
  { label: "Van / Minibus", mpg: 20, kwhPer100km: 24 },
];

const FUEL_PRICES_USD = { Petrol: 3.6, Diesel: 3.9, Electric: 0.15 };

export default function FuelCalculator() {
  const { currency } = useApp();
  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [fuelType, setFuelType] = useState("Petrol");
  const [distanceKm, setDistanceKm] = useState(400);
  const [fuelPrice, setFuelPrice] = useState(FUEL_PRICES_USD.Petrol);
  const [tolls, setTolls] = useState(15);
  const [parking, setParking] = useState(10);

  const vehicle = VEHICLES[vehicleIdx];
  const isElectric = fuelType === "Electric";

  const result = useMemo(() => {
    if (isElectric) {
      const kwhNeeded = (distanceKm / 100) * vehicle.kwhPer100km;
      const energyCost = kwhNeeded * fuelPrice;
      return {
        litersOrKwh: kwhNeeded,
        energyCost,
        total: energyCost + tolls + parking,
      };
    }
    const km_per_l = vehicle.mpg * 0.425144; // mpg (US gallons) -> km/L
    const litersNeeded = distanceKm / km_per_l;
    const fuelCost = litersNeeded * fuelPrice;
    return {
      litersOrKwh: litersNeeded,
      energyCost: fuelCost,
      total: fuelCost + tolls + parking,
    };
  }, [vehicle, distanceKm, fuelPrice, tolls, parking, isElectric]);

  return (
    <div>
      <PageHeader
        eyebrow="Road trips"
        title="What this drive actually costs"
        subtitle="Fuel or charging cost, plus tolls and parking — one total before you leave."
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20 grid md:grid-cols-2 gap-8">
        <div className="ticket p-6 flex flex-col gap-5">
          <label className="block">
            <span className="text-xs text-paper/50">Vehicle type</span>
            <select
              value={vehicleIdx}
              onChange={(e) => setVehicleIdx(Number(e.target.value))}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
            >
              {VEHICLES.map((v, i) => <option key={v.label} value={i}>{v.label}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-paper/50">Fuel type</span>
            <select
              value={fuelType}
              onChange={(e) => {
                setFuelType(e.target.value);
                setFuelPrice(FUEL_PRICES_USD[e.target.value]);
              }}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
            >
              {Object.keys(FUEL_PRICES_USD).map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-paper/50">Distance (km)</span>
            <input
              type="number" min={0} value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono"
            />
          </label>

          <label className="block">
            <span className="text-xs text-paper/50">{isElectric ? "Electricity price (USD/kWh)" : "Fuel price (USD/liter)"}</span>
            <input
              type="number" min={0} step={0.01} value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-paper/50">Tolls (USD)</span>
              <input
                type="number" min={0} value={tolls}
                onChange={(e) => setTolls(Number(e.target.value))}
                className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono"
              />
            </label>
            <label className="block">
              <span className="text-xs text-paper/50">{isElectric ? "Charging fees (USD)" : "Parking (USD)"}</span>
              <input
                type="number" min={0} value={parking}
                onChange={(e) => setParking(Number(e.target.value))}
                className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none font-mono"
              />
            </label>
          </div>
        </div>

        <div className="ticket p-6 flex flex-col justify-center items-center text-center">
          {isElectric ? <Zap size={26} className="text-brass mb-3" /> : <Fuel size={26} className="text-brass mb-3" />}
          <p className="text-xs uppercase tracking-widest text-brass font-mono">Total road trip cost</p>
          <p className="font-display text-5xl mt-3">{formatMoney(result.total, currency)}</p>
          <div className="w-full mt-8 flex flex-col gap-2 text-sm text-paper/60">
            <div className="flex justify-between border-t border-paper/10 pt-2">
              <span>{isElectric ? "Energy needed" : "Fuel needed"}</span>
              <span className="font-mono">{result.litersOrKwh.toFixed(1)} {isElectric ? "kWh" : "L"}</span>
            </div>
            <div className="flex justify-between">
              <span>{isElectric ? "Charging cost" : "Fuel cost"}</span>
              <span className="font-mono">{formatMoney(result.energyCost, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tolls</span>
              <span className="font-mono">{formatMoney(tolls, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isElectric ? "Charging fees" : "Parking"}</span>
              <span className="font-mono">{formatMoney(parking, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
