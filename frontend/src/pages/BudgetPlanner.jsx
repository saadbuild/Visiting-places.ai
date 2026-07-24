import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "../components/Shared";
import { useApp } from "../context/AppContext";
import { formatMoney, CURRENCIES } from "../lib/format";

const COLORS = ["#C88A3B", "#B0432A", "#5C6670", "#E8AD5E", "#D0654A", "#3F4750", "#8F5E22"];

function Field({ label, value, onChange, suffix }) {
  return (
    <label className="block">
      <span className="text-xs text-paper/50">{label}</span>
      <div className="flex items-center gap-2 mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-transparent outline-none w-full font-mono"
        />
        {suffix && <span className="text-xs text-paper/40 shrink-0">{suffix}</span>}
      </div>
    </label>
  );
}

export default function BudgetPlanner() {
  const { currency, updatePrefs } = useApp();
  const [params] = useSearchParams();

  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(7);
  const [flightPerPerson, setFlightPerPerson] = useState(450);
  const [hotelPerNight, setHotelPerNight] = useState(Number(params.get("hotel")) || 120);
  const [foodPerPersonDay, setFoodPerPersonDay] = useState(40);
  const [activitiesTotal, setActivitiesTotal] = useState(200);
  const [transportTotal, setTransportTotal] = useState(100);
  const [shoppingTotal, setShoppingTotal] = useState(150);
  const [taxRate, setTaxRate] = useState(8);
  const [emergencyRate, setEmergencyRate] = useState(10);

  const breakdown = useMemo(() => {
    const flights = flightPerPerson * travelers;
    const hotels = hotelPerNight * nights;
    const food = foodPerPersonDay * travelers * nights;
    const activities = activitiesTotal;
    const transport = transportTotal;
    const shopping = shoppingTotal;
    const subtotal = flights + hotels + food + activities + transport + shopping;
    const taxes = subtotal * (taxRate / 100);
    const emergency = subtotal * (emergencyRate / 100);
    const total = subtotal + taxes + emergency;
    return { flights, hotels, food, activities, transport, shopping, taxes, emergency, total, subtotal };
  }, [travelers, nights, flightPerPerson, hotelPerNight, foodPerPersonDay, activitiesTotal, transportTotal, shoppingTotal, taxRate, emergencyRate]);

  const chartData = [
    { name: "Flights", value: breakdown.flights },
    { name: "Hotels", value: breakdown.hotels },
    { name: "Food", value: breakdown.food },
    { name: "Activities", value: breakdown.activities },
    { name: "Transport", value: breakdown.transport },
    { name: "Shopping", value: breakdown.shopping },
    { name: "Taxes", value: breakdown.taxes },
    { name: "Emergency fund", value: breakdown.emergency },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <PageHeader
        eyebrow="Budget"
        title="One honest total, before you book anything"
        subtitle="Every line item is editable — this updates in real time as you adjust."
      >
        <select
          value={currency}
          onChange={(e) => updatePrefs({ currency: e.target.value })}
          className="bg-ink-700 border border-paper/15 rounded-full px-4 py-2 text-sm outline-none"
        >
          {Object.keys(CURRENCIES).map((c) => <option key={c}>{c}</option>)}
        </select>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 ticket p-6 grid sm:grid-cols-2 gap-5">
          <Field label="Travelers" value={travelers} onChange={setTravelers} />
          <Field label="Nights" value={nights} onChange={setNights} />
          <Field label="Flight per person" value={flightPerPerson} onChange={setFlightPerPerson} suffix="USD" />
          <Field label="Hotel per night" value={hotelPerNight} onChange={setHotelPerNight} suffix="USD" />
          <Field label="Food per person / day" value={foodPerPersonDay} onChange={setFoodPerPersonDay} suffix="USD" />
          <Field label="Activities (total)" value={activitiesTotal} onChange={setActivitiesTotal} suffix="USD" />
          <Field label="Local transport (total)" value={transportTotal} onChange={setTransportTotal} suffix="USD" />
          <Field label="Shopping (total)" value={shoppingTotal} onChange={setShoppingTotal} suffix="USD" />
          <Field label="Estimated taxes/fees" value={taxRate} onChange={setTaxRate} suffix="%" />
          <Field label="Emergency buffer" value={emergencyRate} onChange={setEmergencyRate} suffix="%" />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="ticket p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-brass font-mono">Total estimated cost</p>
            <p className="font-display text-4xl mt-2">{formatMoney(breakdown.total, currency)}</p>
            <p className="text-xs text-paper/45 mt-1">{formatMoney(breakdown.total / travelers, currency)} per person</p>
          </div>

          <div className="ticket p-6">
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatMoney(v, currency)}
                    contentStyle={{ background: "#221B15", border: "1px solid rgba(241,230,200,0.15)", borderRadius: 10, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-paper/60">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name}: {formatMoney(d.value, currency)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
