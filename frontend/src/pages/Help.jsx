import { Link } from "react-router-dom";
import { PageHeader } from "../components/Shared";
import InitialsAvatar from "../components/InitialsAvatar";
import {
  Compass, Sparkles, Hotel, Wallet, Fuel, Save, Headset, MapPin,
  Globe2, CreditCard, BotMessageSquare,
} from "lucide-react";

const GUIDES = [
  { icon: Compass, title: "How to use the platform", text: "Start on Explore to find a destination, then use Plan tools to build the details.", to: "/explore" },
  { icon: Sparkles, title: "How the AI trip planner works", text: "It builds a day-by-day plan from your interests and dates using real listings for that destination.", to: "/trip-planner" },
  { icon: Hotel, title: "How to search and compare hotels", text: "Filter by type and price on the Hotels page, then open a listing to compare amenities and cancellation terms.", to: "/hotels" },
  { icon: Wallet, title: "How to calculate a trip budget", text: "The Budget Planner totals flights, stays, food, and activities live as you edit each field.", to: "/budget-planner" },
  { icon: Fuel, title: "How to calculate fuel costs", text: "Pick a vehicle and fuel type on the Fuel Calculator to estimate a full road trip's cost.", to: "/fuel-calculator" },
  { icon: Save, title: "How to save a trip", text: "Generate an itinerary, then hit \"Save trip\" — it'll appear on your Dashboard. Sign in first.", to: "/dashboard" },
  { icon: MapPin, title: "How the live map works", text: "Share your location or drop a pin, then filter by category to see what's actually nearby.", to: "/map" },
  { icon: CreditCard, title: "How subscriptions & payment work", text: "Pick Basic, Standard, or Pro on Pricing. Paid plans are billed manually via JazzCash, EasyPaisa, or NayaPay and verified by our team.", to: "/pricing" },
  { icon: Headset, title: "How to contact support", text: "Use the Contact page for anything the FAQ doesn't cover.", to: "/contact" },
];

const PLATFORM_SERVICES = [
  { icon: Globe2, text: "Destination discovery — explore places, attractions, restaurants & local foods worldwide" },
  { icon: Hotel, text: "Hotel search & comparison with real amenities and cancellation terms" },
  { icon: BotMessageSquare, text: "AI trip planner & AI travel assistant for day-by-day itineraries and quick travel questions" },
  { icon: Wallet, text: "Budget planner, fuel calculator, live weather & an interactive map" },
  { icon: CreditCard, text: "Simple subscription plans with manual JazzCash / EasyPaisa / NayaPay billing" },
];

export default function Help() {
  return (
    <div>
      <PageHeader eyebrow="Help center" title="Guides for getting the most out of Visiting Places" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-16 grid sm:grid-cols-2 gap-5">
        {GUIDES.map((g) => (
          <Link key={g.title} to={g.to} className="ticket p-6 hover:border-brass/50 transition-colors">
            <g.icon size={20} className="text-brass mb-3" />
            <p className="font-display text-lg mb-1.5">{g.title}</p>
            <p className="text-sm text-paper/55 leading-relaxed">{g.text}</p>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        <div className="ticket p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-brass font-mono mb-5">Who builds this</p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:w-40 shrink-0">
              <InitialsAvatar initials="SA" size={96} />
              <div className="sm:mt-1">
                <p className="font-display text-lg leading-tight">Saad Ali</p>
                <p className="text-xs text-paper/50 mt-0.5">Founder & CEO, Techtig</p>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-paper/70 leading-relaxed">
                Visiting Places is designed and developed by <span className="text-brass">Techtig</span>, a
                small digital studio led by Saad Ali. Techtig built every part of this platform — from the
                destination catalog to the AI trip planner to the subscription system you saw on the Pricing page.
              </p>
              <p className="text-sm text-paper/50 mt-4 mb-3">In short, here's what Visiting Places gives you:</p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {PLATFORM_SERVICES.map((s) => (
                  <li key={s.text} className="flex items-start gap-2 text-sm text-paper/65">
                    <s.icon size={15} className="text-brass mt-0.5 shrink-0" />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-paper/45 mt-5">
                Curious what else Techtig builds? See the{" "}
                <Link to="/about" className="text-brass underline underline-offset-2">About page</Link> for the
                studio's services and where to find them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
