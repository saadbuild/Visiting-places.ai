import { Link } from "react-router-dom";
import { Compass, Instagram, Twitter, Facebook } from "lucide-react";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { to: "/explore", label: "Destinations" },
      { to: "/hotels", label: "Hotels" },
      { to: "/restaurants", label: "Restaurants" },
      { to: "/foods", label: "Local foods" },
      { to: "/attractions", label: "Attractions" },
    ],
  },
  {
    title: "Plan",
    links: [
      { to: "/trip-planner", label: "AI trip planner" },
      { to: "/budget-planner", label: "Budget planner" },
      { to: "/fuel-calculator", label: "Fuel calculator" },
      { to: "/weather", label: "Weather" },
      { to: "/map", label: "Live map" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/help", label: "Help center" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact us" },
      { to: "/about", label: "About" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy policy" },
      { to: "/terms", label: "Terms of service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid grid-cols-2 md:grid-cols-6 gap-10">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <Compass size={20} className="text-brass" />
            <span className="font-display text-lg">
              Visiting <span className="text-brass italic">Places</span>
            </span>
          </Link>
          <p className="text-sm text-paper/55 mt-3 max-w-xs leading-relaxed">
            Every trip, planned like it's the only one that matters — AI recommendations,
            real weather, honest budgets.
          </p>
          <div className="flex items-center gap-3 mt-5 text-paper/50">
            <Instagram size={18} className="hover:text-brass transition-colors cursor-pointer" />
            <Twitter size={18} className="hover:text-brass transition-colors cursor-pointer" />
            <Facebook size={18} className="hover:text-brass transition-colors cursor-pointer" />
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-widest text-brass font-mono mb-3">{col.title}</p>
            <div className="flex flex-col gap-2">
              {col.links.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-paper/60 hover:text-brass transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-paper/10 py-5">
        <p className="text-center text-xs text-paper/40 font-mono">
          © {new Date().getFullYear()} Visiting Places. Built for wandering, responsibly.
        </p>
      </div>
    </footer>
  );
}
