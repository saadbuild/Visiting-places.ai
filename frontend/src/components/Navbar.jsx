import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Menu, X, ChevronDown, User, Heart, LayoutDashboard, LogOut, Sparkles, ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DISCOVER = [
  { to: "/explore", label: "Explore destinations" },
  { to: "/hotels", label: "Hotels" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/foods", label: "Local foods" },
  { to: "/attractions", label: "Attractions" },
];

const PLAN = [
  { to: "/trip-planner", label: "AI trip planner" },
  { to: "/budget-planner", label: "Budget planner", tier: "Standard+" },
  { to: "/fuel-calculator", label: "Fuel calculator", tier: "Standard+" },
  { to: "/flights", label: "Flights" },
  { to: "/transport", label: "Transportation" },
  { to: "/weather", label: "Weather", tier: "Standard+" },
  { to: "/map", label: "Live map" },
  { to: "/assistant", label: "AI assistant" },
];

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm text-paper/80 hover:text-brass transition-colors py-2">
        {label} <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-2 w-56 z-40"
          >
            <div className="ticket bg-ink-700 p-2 shadow-ticket">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-paper/80 hover:bg-ink-600 hover:text-brass transition-colors"
                >
                  {item.label}
                  {item.tier && (
                    <span className="text-[9px] font-mono uppercase tracking-widest text-brass/70 border border-brass/30 rounded-full px-1.5 py-0.5">
                      {item.tier}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Compass size={22} className="text-brass" />
          <span className="font-display text-lg tracking-tight">
            Visiting <span className="text-brass italic">Places</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-8">
          <NavDropdown label="Discover" items={DISCOVER} />
          <NavDropdown label="Plan" items={PLAN} />
          <NavLink to="/pricing" className={({isActive}) => `text-sm py-2 transition-colors ${isActive ? "text-brass" : "text-paper/80 hover:text-brass"}`}>
            Pricing
          </NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm py-2 transition-colors ${isActive ? "text-brass" : "text-paper/80 hover:text-brass"}`}>
            About
          </NavLink>
          <NavLink to="/help" className={({isActive}) => `text-sm py-2 transition-colors ${isActive ? "text-brass" : "text-paper/80 hover:text-brass"}`}>
            Help
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-4 ml-auto">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenu(true)}
              onMouseLeave={() => setUserMenu(false)}
            >
              <button className="flex items-center gap-2 rounded-full border border-paper/15 pl-1.5 pr-3 py-1.5 hover:border-brass/60 transition-colors">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-brass/20 text-brass text-xs font-semibold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm text-paper/85">{user.name?.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full pt-2 w-52 z-40"
                  >
                    <div className="ticket bg-ink-700 p-2 shadow-ticket">
                      <Link to="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-paper/80 hover:bg-ink-600 hover:text-brass">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/favorites" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-paper/80 hover:bg-ink-600 hover:text-brass">
                        <Heart size={15} /> Favorites
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-paper/80 hover:bg-ink-600 hover:text-brass">
                        <User size={15} /> Profile & settings
                      </Link>
                      <Link to="/pricing" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-paper/80 hover:bg-ink-600 hover:text-brass">
                        <Sparkles size={15} /> Plans & billing
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-brass hover:bg-ink-600">
                          <ShieldCheck size={15} /> Admin
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-coral-light hover:bg-ink-600"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/sign-in" className="text-sm text-paper/85 hover:text-brass transition-colors">
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="text-sm font-medium bg-brass text-ink-800 px-4 py-2 rounded-full hover:bg-brass-light transition-colors"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-ink-800 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-paper/10">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-6">
              {user && (
                <div className="ticket p-4 flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-brass/20 text-brass font-semibold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-paper/50">{user.email || user.phone}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-brass mb-2 font-mono">Discover</p>
                <div className="flex flex-col gap-1">
                  {DISCOVER.map((i) => (
                    <Link key={i.to} to={i.to} onClick={() => setMobileOpen(false)} className="py-2 text-paper/85 hover:text-brass">
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-brass mb-2 font-mono">Plan</p>
                <div className="flex flex-col gap-1">
                  {PLAN.map((i) => (
                    <Link key={i.to} to={i.to} onClick={() => setMobileOpen(false)} className="py-2 text-paper/85 hover:text-brass flex items-center justify-between gap-2">
                      {i.label}
                      {i.tier && (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brass/70 border border-brass/30 rounded-full px-1.5 py-0.5">
                          {i.tier}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-brass mb-2 font-mono">Pricing</p>
                <Link to="/pricing" onClick={() => setMobileOpen(false)} className="py-2 block text-paper/85 hover:text-brass">
                  Plans & payment
                </Link>
              </div>
              <div className="flex flex-col gap-1 border-t border-paper/10 pt-4">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-paper/85">Dashboard</Link>
                    <Link to="/favorites" onClick={() => setMobileOpen(false)} className="py-2 text-paper/85">Favorites</Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="py-2 text-paper/85">Profile & settings</Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-brass font-medium flex items-center gap-2">
                        <ShieldCheck size={15} /> Admin
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); navigate("/"); }} className="text-left py-2 text-coral-light">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="py-2 text-paper/85">Sign in</Link>
                    <Link to="/sign-up" onClick={() => setMobileOpen(false)} className="py-2 text-brass font-medium">Create account</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
